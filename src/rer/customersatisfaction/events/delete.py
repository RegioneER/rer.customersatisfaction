# -*- coding: utf-8 -*-
from rer.customersatisfaction.interfaces import ICustomerSatisfactionStore
from zope.component import getUtility


def deleteContent(context, event):
    store = ICustomerSatisfactionStore
    tool = getUtility(store)
    reviews = tool.search(query={"uid": context.UID()})
    for review in reviews:
        tool.delete(id=review.intid)
