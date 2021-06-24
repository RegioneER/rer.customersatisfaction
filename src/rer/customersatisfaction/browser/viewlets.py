# -*- coding: utf-8 -*-
from plone.app.layout.viewlets.common import ViewletBase
from plone import api


class CustomerSatisfactionViewlet(ViewletBase):
    """
    """

    def render(self):
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
