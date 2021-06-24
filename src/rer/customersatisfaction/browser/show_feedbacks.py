# -*- coding: utf-8 -*-
from datetime import datetime
from plone import api
from plone.restapi.serializer.converters import json_compatible
from Products.Five import BrowserView
from rer.customersatisfaction import _
from rer.customersatisfaction.interfaces import ICustomerSatisfactionStore
from zope.component import getUtility

import logging

logger = logging.getLogger(__name__)


class View(BrowserView):
    def get_data(self):
        tool = getUtility(ICustomerSatisfactionStore)
        vote = self.request.form.get("vote", "")
        query = {"uid": self.context.UID()}
        if vote in ["ok", "nok"]:
            query["vote"] = vote
        return [self.format_data(x) for x in tool.search(query=query)]

    def format_data(self, item):
        uid = item._attrs.get("uid", "")
        res = {
            "title": item._attrs.get("title", ""),
            "date": item._attrs.get("date", ""),
            "vote": item._attrs.get("vote", ""),
            "comment": item._attrs.get("comment", ""),
        }

        obj = api.content.get(UID=uid)
        if obj:
            # can be changed
            res["title"] = obj.Title()
            res["url"] = obj.absolute_url()
        return res
