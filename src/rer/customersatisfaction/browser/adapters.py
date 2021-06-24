# -*- coding: utf-8 -*-
from plone import api
from plone.app.layout.globals.interfaces import IBodyClassAdapter
from plone.dexterity.interfaces import IDexterityContent
from zope.component import adapter
from zope.interface import implementer
from rer.customersatisfaction.interfaces import IRerCustomersatisfactionLayer


@adapter(IDexterityContent, IRerCustomersatisfactionLayer)
@implementer(IBodyClassAdapter)
class CustomerSatisfactionBodyClasses(object):
    def __init__(self, context, request):
        self.context = context
        self.request = request

    def get_classes(self, template, view):
        """
        Add a custom class to body tag if we can vote
        """
        context_state = api.content.get_view(
            context=self.context,
            request=self.request,
            name=u"plone_context_state",
        )
        if context_state.canonical_object() == api.portal.get():
            return []
        if not context_state.is_view_template():
            return []
        return ["customer-satisfaction-enabled"]
