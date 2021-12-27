# -*- coding: utf-8 -*-
from plone.app.layout.viewlets.common import ViewletBase
from plone import api

try:
    from collective.recaptcha.settings import IRecaptchaSettings  # noqa

    HAS_COLLECTIVE_RECAPTCHA = True
except ImportError:
    HAS_COLLECTIVE_RECAPTCHA = False

import logging

logger = logging.getLogger(__name__)


class CustomerSatisfactionViewlet(ViewletBase):
    """ """

    def render(self):
        """
        Show viewlet only if collective.recaptcha is installed and configured
        or if we are in the right context
        """

        if not HAS_COLLECTIVE_RECAPTCHA:
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
