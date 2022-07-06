# -*- coding: utf-8 -*-
from plone import api
from plone.api.exc import InvalidParameterError
from plone.app.layout.viewlets.common import ViewletBase

try:
    from collective.recaptcha.settings import IRecaptchaSettings  # noqa

    HAS_COLLECTIVE_RECAPTCHA = True
except ImportError:
    HAS_COLLECTIVE_RECAPTCHA = False

import logging

logger = logging.getLogger(__name__)


class CustomerSatisfactionViewlet(ViewletBase):
    """ """

    @property
    def captcha_disabled(self):
        try:
            return api.portal.get_registry_record(
                "rer.customersatisfaction.disable_recaptcha"
            )
        except InvalidParameterError:
            return False

    def render(self):
        """
        Show viewlet only if collective.recaptcha is installed and configured
        or if we are in the right context
        """
        if not HAS_COLLECTIVE_RECAPTCHA and not self.captcha_disabled:
            return ""

        context_state = api.content.get_view(
            context=self.context,
            request=self.request,
            name=u"plone_context_state",
        )
        if context_state.canonical_object() == api.portal.get():
            return ""
        if not context_state.is_view_template():
            return ""
        return self.index()
