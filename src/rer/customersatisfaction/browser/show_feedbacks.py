# -*- coding: utf-8 -*-
from plone import api
from Products.Five import BrowserView
from rer.customersatisfaction.interfaces import ICustomerSatisfactionStore
from zope.component import getUtility
from Products.CMFPlone.PloneBatch import Batch

import logging

logger = logging.getLogger(__name__)


class View(BrowserView):
    def get_data(self):
        tool = getUtility(ICustomerSatisfactionStore)
        query_vote = self.request.form.get("vote", "")
        query = {"uid": self.context.UID()}
        # if vote in ["ok", "nok"]:
        #     query["vote"] = vote
        search_results = tool.search(query=query)
        res = {
            "ok": 0,
            "ok_with_comments": 0,
            "nok": 0,
            "nok_with_comments": 0,
            "total": len(search_results),
            "comments": [],
        }
        for review in tool.search(query=query):
            data = self.format_data(review)
            vote = data.get("vote", "")
            comment = data.get("comment", "")
            if vote not in ["ok", "nok"]:
                continue
            res[vote] += 1
            if comment:
                res["{}_with_comments".format(vote)] += 1
                if query_vote and query_vote != vote:
                    continue
                res["comments"].append(data)
        b_size = self.request.form.get("b_size", 20)
        b_start = self.request.form.get("b_start", 0)
        res["comments"] = Batch(res["comments"], int(b_size), int(b_start))
        return res

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
