# -*- coding: utf-8 -*-
from plone import api
from rer.customersatisfaction.interfaces import ICustomerSatisfactionStore
from rer.customersatisfaction.restapi.services.common import DataGet
from plone.restapi.batching import HypermediaBatch
from plone.restapi.search.utils import unflatten_dotted_dict
from plone.restapi.serializer.converters import json_compatible
from zope.component import getUtility
from rer.customersatisfaction.restapi.services.common import DataCSVGet
from six import StringIO


import csv
import logging
import six

logger = logging.getLogger(__name__)


class CustomerSatisfactionGet(DataGet):
    """
    Called on context
    """

    def reply(self):
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
                reviews[uid] = {
                    "ok": 0,
                    "nok": 0,
                    "comments": [],
                    "title": review._attrs.get("title", ""),
                    "uid": uid,
                    "review_ids": [],
                }
                obj = api.content.get(UID=uid)
                if obj:
                    # can be changed
                    reviews[uid]["title"] = obj.Title()
                    reviews[uid]["url"] = obj.absolute_url()
            data = reviews[uid]
            if vote in ["ok", "nok"]:
                data[vote] += 1
            comment = review._attrs.get("comment", "")
            if comment:
                data["comments"].append(
                    {
                        "comment": comment,
                        "date": json_compatible(date),
                        "vote": vote,
                    }
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
        if sort_on in ["ok", "nok", "title"]:
            result = sorted(result, key=lambda k: k[sort_on], reverse=reverse)
        return result


class CustomerSatisfactionCSVGet(DataCSVGet):
    """
    """

    type = "customer_satisfaction"

    def get_data(self):
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
                    val.encode("utf-8")
                data[k] = val
            uid = item.attrs.get("uid", "")
            if uid:
                ref_obj = api.content.get(UID=uid)
                if ref_obj:
                    data["url"] = ref_obj.absolute_url()
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
        return res.encode()
