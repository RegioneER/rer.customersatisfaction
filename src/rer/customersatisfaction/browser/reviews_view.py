# -*- coding: utf-8 -*-
from Products.Five import BrowserView
from zope.component import getUtility
from rer.customersatisfaction.interfaces import ICustomerSatisfactionStore
from plone import api
from Products.CMFPlone.PloneBatch import Batch


class View(BrowserView):
    def get_data(self):
        tool = getUtility(ICustomerSatisfactionStore)
        reviews = {}
        for review in tool.search():
            uid = review._attrs.get("uid", "")
            date = review._attrs.get("date", "")
            vote = review._attrs.get("vote", 0)
            if uid not in reviews:
                reviews[uid] = {
                    "ok": 0,
                    "nok": 0,
                    "comments": [],
                    "title": review._attrs.get("title", ""),
                }
                obj = api.content.get(UID=uid)
                if obj:
                    # can be changed
                    reviews[uid]["title"] = obj.Title()
                    reviews[uid]["url"] = obj.absolute_url()
            data = reviews[uid]
            if vote == 1:
                data["ok"] += 1
            else:
                data["nok"] += 1
            comment = review._attrs.get("comment", "")
            if comment:
                data["comments"].append(
                    {"comment": comment, "date": date, "vote": vote}
                )
            if not data.get("last_date", None):
                data["last_date"] = date
            else:
                if data["last_date"] < date:
                    data["last_date"] = date
        b_size = self.request.form.get("b_size", 20)
        b_start = self.request.form.get("b_start", 0)
        return Batch(list(reviews.values()), b_size, b_start)
