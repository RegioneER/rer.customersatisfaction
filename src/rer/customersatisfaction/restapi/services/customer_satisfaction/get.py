# -*- coding: utf-8 -*-
from AccessControl import Unauthorized
from datetime import datetime
from plone import api
from plone.restapi.batching import HypermediaBatch
from plone.restapi.search.utils import unflatten_dotted_dict
from plone.restapi.serializer.converters import json_compatible
from rer.customersatisfaction.interfaces import ICustomerSatisfactionStore
from rer.customersatisfaction.restapi.services.common import DataGet
from six import StringIO
from zope.component import getUtility

import csv
import logging
import six

logger = logging.getLogger(__name__)


class CustomerSatisfactionGet(DataGet):
    """
    Called on context
    """

    def reply(self):
        if api.user.is_anonymous():
            raise Unauthorized
        results = self.get_data()
        batch = HypermediaBatch(self.request, results)
        data = {
            "@id": batch.canonical_url,
            "items": [self.fix_fields(x) for x in batch],
            "items_total": batch.items_total,
        }
        links = batch.links
        if links:
            data["batching"] = links
        return data

    def fix_fields(self, data):
        data["last_vote"] = json_compatible(data["last_vote"])
        return data

    def get_data(self):
        tool = getUtility(ICustomerSatisfactionStore)
        reviews = {}

        query = unflatten_dotted_dict(self.request.form)
        text = query.get("text", "")
        if text:
            query_res = tool.search(query={"text": text})
        else:
            query_res = tool.search()
        for review in query_res:
            uid = review._attrs.get("uid", "")
            date = review._attrs.get("date", "")
            vote = review._attrs.get("vote", "")
            if uid not in reviews:
                obj = self.get_commented_obj(record=review)
                if not obj and not api.user.has_permission(
                    "rer.customersatisfaction: Show Deleted Feedbacks"
                ):
                    # only manager can list deleted object's reviews
                    continue
                new_data = {
                    "ok": 0,
                    "nok": 0,
                    "comments": [],
                    "title": review._attrs.get("title", ""),
                    "uid": uid,
                    "review_ids": [],
                }
                if obj:
                    # can be changed
                    new_data["title"] = obj.Title()
                    new_data["url"] = obj.absolute_url()
                reviews[uid] = new_data
            data = reviews[uid]
            if vote in ["ok", "nok"]:
                data[vote] += 1
            comment = review._attrs.get("comment", "")
            if comment:
                data["comments"].append(
                    {"comment": comment, "date": json_compatible(date), "vote": vote}
                )
            if not data.get("last_vote", None):
                data["last_vote"] = date
            else:
                if data["last_vote"] < date:
                    data["last_vote"] = date

        result = list(reviews.values())
        sort_on = self.request.form.get("sort_on", "last_date")
        sort_order = self.request.form.get("sort_order", "desc")
        reverse = sort_order.lower() in ["desc", "descending", "reverse"]
        if sort_on in ["ok", "nok", "title", "last_vote", "comments"]:
            result = sorted(result, key=lambda k: k[sort_on], reverse=reverse)
        return result


class CustomerSatisfactionCSVGet(DataGet):
    """ """

    type = "customer_satisfaction"

    def render(self):
        data = self.get_data()
        if isinstance(data, dict):
            if data.get("error", False):
                self.request.response.setStatus(500)
                return dict(
                    error=dict(
                        type="InternalServerError",
                        message="Unable export. Contact site manager.",
                    )
                )
        self.request.response.setHeader("Content-Type", "text/comma-separated-values")
        now = datetime.now()
        self.request.response.setHeader(
            "Content-Disposition",
            'attachment; filename="{type}_{date}.csv"'.format(
                type=self.type, date=now.strftime("%d%m%Y-%H%M%S")
            ),
        )
        self.request.response.write(data)

    def get_data(self):
        if api.user.is_anonymous():
            raise Unauthorized
        tool = getUtility(ICustomerSatisfactionStore)
        sbuf = StringIO()
        rows = []
        columns = [
            "title",
            "url",
            "vote",
            "comment",
            "date",
        ]
        for item in tool.search():
            obj = self.get_commented_obj(record=item)
            if not obj and not api.user.has_permission(
                "rer.customersatisfaction: Show Deleted Feedbacks"
            ):
                # only manager can list deleted object's reviews
                continue
            data = {}
            for k, v in item.attrs.items():
                if k not in columns:
                    continue
                if isinstance(v, list):
                    v = ", ".join(v)
                if isinstance(v, int):
                    v = str(v)
                val = json_compatible(v)
                if six.PY2:
                    val = val.encode("utf-8")
                data[k] = val
            if obj:
                data["url"] = obj.absolute_url()
            else:
                data["url"] = ""
            rows.append(data)
        writer = csv.DictWriter(sbuf, fieldnames=columns, delimiter=",")
        writer.writeheader()
        for row in rows:
            try:
                writer.writerow(row)
            except Exception as e:
                logger.exception(e)
                return {"error": True}
        res = sbuf.getvalue()
        sbuf.close()
        if six.PY2:
            return res
        return res.encode()
