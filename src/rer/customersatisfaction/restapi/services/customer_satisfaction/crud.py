# -*- coding: utf-8 -*-
from plone import api
from plone.protect.interfaces import IDisableCSRFProtection
from rer.customersatisfaction.interfaces import ICustomerSatisfactionStore
from rer.customersatisfaction.restapi.services.common import DataAdd
from rer.customersatisfaction.restapi.services.common import DataClear
from rer.customersatisfaction.restapi.services.common import DataDelete
from zExceptions import BadRequest
from zope.component import getUtility
from zope.interface import alsoProvides

import logging

logger = logging.getLogger(__name__)


class CustomerSatisfactionAdd(DataAdd):
    """
    Called on context
    """

    store = ICustomerSatisfactionStore

    def validate_form(self, form_data):
        """
        check all required fields and parameters
        """
        for field in ["vote"]:
            value = form_data.get(field, "")
            if not value:
                raise BadRequest("Campo obbligatorio mancante: {}".format(field))
            if value not in ["ok", "nok"]:
                raise BadRequest("Voto non valido: {}".format(value))

    def extract_data(self, form_data):
        data = super(CustomerSatisfactionAdd, self).extract_data(form_data)

        context_state = api.content.get_view(
            context=self.context,
            request=self.request,
            name=u"plone_context_state",
        )
        context = context_state.canonical_object()
        data["uid"] = context.UID()
        data["title"] = context.Title()
        return data


class CustomerSatisfactionDelete(DataDelete):
    """"""

    store = ICustomerSatisfactionStore

    def publishTraverse(self, request, id):
        # Consume any path segments after /@addons as parameters
        self.id = id
        return self

    def reply(self):
        alsoProvides(self.request, IDisableCSRFProtection)
        if not self.id:
            raise BadRequest("Missing uid")
        tool = getUtility(self.store)
        reviews = tool.search(query={"uid": self.id})
        for review in reviews:
            res = tool.delete(id=review.intid)
            if not res:
                continue
            if res.get("error", "") == "NotFound":
                raise BadRequest('Unable to find item with id "{}"'.format(self.id))
            self.request.response.setStatus(500)
            return dict(
                error=dict(
                    type="InternalServerError",
                    message="Unable to delete item. Contact site manager.",
                )
            )
        return self.reply_no_content()


class CustomerSatisfactionClear(DataClear):
    """"""

    store = ICustomerSatisfactionStore
