""" Custom discussion events
"""
from rer.customersatisfaction.interfaces import IVoteAddedEvent
from zope.interface import implementer


@implementer(IVoteAddedEvent)
class VoteAddedEvent:
    """Event to be triggered when a vote is added"""

    def __init__(self, context, data):
        self.object = context
        self.vote = data  # vote, comment, title
        request = context.REQUEST
        request.set("event", self)
