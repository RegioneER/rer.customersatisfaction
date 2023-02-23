from rer.customersatisfaction import _

try:
    from plone.app.contentrules.handlers import execute
except ImportError:

    def execute(context, event):
        return False


try:
    from plone.stringinterp.adapters import BaseSubstitution
except ImportError:

    class BaseSubstitution:
        """Fallback class if plone.stringinterp is not available"""

        def __init__(self, context, **kwargs):
            self.context = context


def execute_vote_rules(event):
    """Execute vote content rules"""
    execute(event.object, event)


class VoteSubstitution(BaseSubstitution):
    """Vote string substitution"""

    def __init__(self, context, **kwargs):
        super().__init__(context, **kwargs)

    @property
    def event(self):
        """event that triggered the content rule"""
        return self.context.REQUEST.get("event")

    @property
    def vote(self):
        """Get changed inline comment"""
        return self.event.vote


class Text(VoteSubstitution):
    """Vote text"""

    category = _("Votes")
    description = _("Votes text")

    def safe_call(self):
        """Safe call"""
        text = self.vote.get("comment", "")
        return text


class Vote(VoteSubstitution):
    """Vote vote"""

    category = _("Votes")
    description = _("Votes vote")

    def safe_call(self):
        """Safe call"""
        vote = self.vote.get("vote", "")
        return vote
