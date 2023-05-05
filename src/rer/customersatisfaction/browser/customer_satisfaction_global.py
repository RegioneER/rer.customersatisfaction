# -*- coding: utf-8 -*-
from Products.Five import BrowserView
from Products.CMFPlone.browser.admin import Overview
from plone.memoize import ram

from time import time

import pkg_resources

APP_NAME = "customer_satisfaction_global"
JS_TEMPLATE = (
    "/++plone++rer.customersatisfaction/dist/prod/{name}.js?v={version}"  # noqa
)
CSS_TEMPLATE = (
    "/++plone++rer.customersatisfaction/dist/prod/{name}.css?v={version}"  # noqa
)


class View(Overview, BrowserView):
    """ """

    @ram.cache(lambda *args: time() // (60 * 60))
    def get_version(self):
        return pkg_resources.get_distribution("rer.customersatisfaction").version

    def get_resource_js(self, name=APP_NAME):
        return JS_TEMPLATE.format(
            name=name,
            version=self.get_version(),
        )

    def get_resource_css(self, name=APP_NAME):
        return CSS_TEMPLATE.format(
            name=name,
            version=self.get_version(),
        )
