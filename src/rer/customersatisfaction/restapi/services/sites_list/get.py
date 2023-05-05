from Products.CMFPlone.browser.admin import Overview

import json


class View(Overview):
    def __call__(self):
        data = []
        for site in self.sites():
            site_url = site.portal_url()
            data.append(
                {
                    "id": site.id,
                    "url": site_url,
                    "title": site.title,
                }
            )

        self.set_headers()

        return json.dumps(data)

    def set_headers(self):
        self.request.response.setHeader("Content-type", "application/json")
        self.request.response.setHeader("Access-Control-Allow-Origin", "*")
