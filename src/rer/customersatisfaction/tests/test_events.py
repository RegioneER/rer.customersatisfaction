from ..testing import RER_CUSTOMERSATISFACTION_INTEGRATION_TESTING
from plone import api
from plone.app.testing import setRoles
from plone.app.testing import TEST_USER_ID
from Zope2.App import zcml
from zope.component import getUtility
from rer.customersatisfaction.interfaces import ICustomerSatisfactionStore

import Products.Five
import unittest


#
# Fake events registry
#


class VotesRegistry:
    """Fake registry to be used while testing vote events"""

    voteAdded = False


#
# Fake event handlers
#


def vote_added(doc, evt):
    VotesRegistry.voteAdded = True


#
# Tests
#


class VotesEventsTest(unittest.TestCase):
    """Test custom vote events"""

    layer = RER_CUSTOMERSATISFACTION_INTEGRATION_TESTING

    def setUp(self):
        self.portal = self.layer["portal"]
        self.request = self.layer["request"]
        self.registry = VotesRegistry

        setRoles(self.portal, TEST_USER_ID, ["Manager"])

        self.document = api.content.create(
            title="Document", container=self.portal, type="Document"
        )

        #
        # Subscribers
        #
        configure = """
        <configure
          xmlns="http://namespaces.zope.org/zope">

          <subscriber
            for="OFS.interfaces.ISimpleItem
                 rer.customersatisfaction.interfaces.IVoteAddedEvent"
            handler="rer.customersatisfaction.tests.test_events.vote_added"
            />

         </configure>
        """
        zcml.load_config("configure.zcml", Products.Five)
        zcml.load_string(configure)

    def test_addEvent(self):
        self.assertFalse(self.registry.voteAdded)
        tool = getUtility(ICustomerSatisfactionStore)
        uid = api.content.get_uuid(obj=self.document)
        # Create vote
        tool.add({"vote": 1, "comment": "is ok", "uid": uid})
        self.assertTrue(self.registry.voteAdded)
