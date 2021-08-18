# -*- coding: utf-8 -*-
from AccessControl import Unauthorized
from copy import deepcopy
from plone import api
from plone.protect.interfaces import IDisableCSRFProtection
from plone.restapi.batching import HypermediaBatch
from plone.restapi.deserializer import json_body
from plone.restapi.search.utils import unflatten_dotted_dict
from plone.restapi.serializer.converters import json_compatible
from plone.restapi.services import Service
from zExceptions import BadRequest
from zope.component import getUtility
from zope.interface import alsoProvides
from zope.interface import implementer
from zope.publisher.interfaces import IPublishTraverse

import logging

logger = logging.getLogger(__name__)


class DataGet(Service):
    def reply(self):
        tool = getUtility(self.store)
        query = self.parse_query()
        batch = HypermediaBatch(self.request, tool.search(**query))
        data = {
            "@id": batch.canonical_url,
            "items": [self.expand_data(x) for x in batch],
            "items_total": batch.items_total,
        }
        links = batch.links
        if links:
            data["batching"] = links
        return data

    def expand_data(self, record):
        data = {k: json_compatible(v) for k, v in record.attrs.items()}
        data["id"] = record.intid
        return data

    def parse_query(self):
        query = deepcopy(self.request.form)
        query = unflatten_dotted_dict(query)
        res = {}
        if "sort_on" in query:
            res["sort_index"] = query["sort_on"]
            del query["sort_on"]
        if "sort_order" in query:
            order = query["sort_order"]
            reverse = True
            if order in ["asc", "ascending"]:
                reverse = False
            res["reverse"] = reverse
            del query["sort_order"]
        res["query"] = query
        return res

    def get_commented_obj(self, record):
        uid = record._attrs.get("uid", "")
        try:
            obj = api.content.get(UID=uid)
        except Unauthorized:
            return

        if not obj:
            return
        if not api.user.has_permission(
            "rer.customersatisfaction: Access Customer Satisfaction", obj=obj
        ):
            # user does not have that permission on object
            return
        return obj


class DataAdd(Service):
    def reply(self):
        alsoProvides(self.request, IDisableCSRFProtection)
        form_data = json_body(self.request)
        self.validate_form(form_data=form_data)
        data = self.extract_data(form_data=form_data)
        tool = getUtility(self.store)
        try:
            res = tool.add(data)
        except ValueError as e:
            self.request.response.setStatus(500)
            return dict(
                error=dict(
                    type="InternalServerError",
                    message=getattr(e, "message", e.__str__()),
                )
            )

        if res:
            return self.reply_no_content()

        self.request.response.setStatus(500)
        return dict(
            error=dict(
                type="InternalServerError",
                message="Unable to add. Contact site manager.",
            )
        )

    def validate_form(self, form_data):
        pass

    def extract_data(self, form_data):
        return json_body(self.request)


@implementer(IPublishTraverse)
class TraversableService(Service):
    """ Update an entry """

    def __init__(self, context, request):
        super(TraversableService, self).__init__(context, request)
        self.id = ""
        self.errors = {}

    def publishTraverse(self, request, id):
        # Consume any path segments after /@addons as parameters
        try:
            self.id = int(id)
        except ValueError:
            raise BadRequest("Id should be a number.")
        return self

    def reply(self):
        raise NotImplementedError


class DataUpdate(TraversableService):
    """ Update an entry """

    def reply(self):
        alsoProvides(self.request, IDisableCSRFProtection)
        if not self.id:
            raise BadRequest("Missing id")

        form_data = json_body(self.request)

        tool = getUtility(self.store)
        res = tool.update(id=self.id, data=form_data)
        if not res:
            return self.reply_no_content()
        if res.get("error", "") == "NotFound":
            raise BadRequest('Unable to find item with id "{}"'.format(self.id))
        self.request.response.setStatus(500)
        return dict(
            error=dict(
                type="InternalServerError",
                message="Unable to update item. Contact site manager.",
            )
        )


class DataDelete(TraversableService):
    def reply(self):
        alsoProvides(self.request, IDisableCSRFProtection)
        if not self.id:
            raise BadRequest("Missing id")
        tool = getUtility(self.store)
        res = tool.delete(id=self.id)
        if not res:
            return self.reply_no_content()
        if res.get("error", "") == "NotFound":
            raise BadRequest('Unable to find item with id "{}"'.format(self.id))
        self.request.response.setStatus(500)
        return dict(
            error=dict(
                type="InternalServerError",
                message="Unable to delete item. Contact site manager.",
            )
        )


class DataClear(Service):
    def reply(self):
        alsoProvides(self.request, IDisableCSRFProtection)
        tool = getUtility(self.store)
        tool.clear()
        return self.reply_no_content()
