# -*- coding: utf-8 -*-
from AccessControl.unauthorized import Unauthorized
from plone import api
from Products.CMFPlone.PloneBatch import Batch
from Products.Five import BrowserView
from rer.customersatisfaction import _
from rer.customersatisfaction.interfaces import ICustomerSatisfactionStore
from zope.component import getUtility
from zope.publisher.interfaces import NotFound

import logging

logger = logging.getLogger(__name__)


class View(BrowserView):
    def __call__(self):
        uid = self.request.form.get("uid", "")
        if not uid:
            api.portal.show_message(
                message=_(
                    "show_feedbacks_missing_uid",
                    default=u"You need to provide a UID.",
                ),
                request=self.request,
                type="error",
            )
            return self.request.response.redirect(api.portal.get().portal_url())
        self.check_access(uid=uid)
        return super(View, self).__call__()

    def check_access(self, uid):
        """
        Validate access permission to the item
        """
        item = api.content.get(UID=uid)
        if not item:
            raise NotFound(self, uid)
        if not api.user.has_permission(
            "rer.customersatisfaction: Access Customer Satisfaction", obj=item
        ):
            raise Unauthorized(
                _(
                    "show_feedbacks_unauthorized",
                    default=u"You don't have access to this content.",
                )
            )

    def get_data(self):
        tool = getUtility(ICustomerSatisfactionStore)
        query_vote = self.request.form.get("vote", "")
        uid = self.request.form.get("uid", "")
        query = {"uid": uid}
        search_results = tool.search(query=query)
        tot = len(search_results)

        res = {
            "ok": 0,
            "ok_with_comments": 0,
            "nok": 0,
            "nok_with_comments": 0,
            "total": tot,
            "comments": [],
            "title": "",
        }

        if tot == 0:
            return res
        res["title"] = search_results[0]._attrs.get("title", "")
        for review in search_results:
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
