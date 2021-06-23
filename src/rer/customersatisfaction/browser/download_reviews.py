# -*- coding: utf-8 -*-
from datetime import datetime
from plone import api
from plone.restapi.serializer.converters import json_compatible
from Products.Five import BrowserView
from rer.customersatisfaction import _
from rer.customersatisfaction.interfaces import ICustomerSatisfactionStore
from six import StringIO
from zope.component import getUtility

import csv
import logging

logger = logging.getLogger(__name__)


class View(BrowserView):
    def __call__(self):
        data = self.get_data()
        if isinstance(data, dict):
            if data.get("error", False):
                api.portal.show_message(
                    message=_(
                        "csd_generation_error",
                        default="Unable to export data in csv. Please contact site administrator.",  # noqa
                    ),
                    request=self.request,
                )
                return self.request.response.redirect(
                    "{0}/@@site-reviews".format(
                        api.portal.get().absolute_url()
                    )
                )
        self.request.response.setHeader(
            "Content-Type", "text/comma-separated-values"
        )
        now = datetime.now()
        self.request.response.setHeader(
            "Content-Disposition",
            'attachment; filename="{portal}_reviews_{date}.csv"'.format(
                portal=api.portal.get().getId(),
                date=now.strftime("%d%m%Y_%H%M%S"),
            ),
        )
        return data

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
                data[k] = json_compatible(v).encode("utf-8")
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
        return res
