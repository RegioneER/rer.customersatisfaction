# -*- coding: utf-8 -*-
from repoze.catalog.catalog import Catalog
from repoze.catalog.indexes.field import CatalogFieldIndex
from souper.interfaces import ICatalogFactory
from souper.soup import NodeAttributeIndexer
from zope.interface import implementer

# from repoze.catalog.indexes.text import CatalogTextIndex
# from souper.soup import NodeTextIndexer
# from repoze.catalog.indexes.keyword import CatalogKeywordIndex


@implementer(ICatalogFactory)
class CustomerSatisfactionSoupCatalogFactory(object):
    def __call__(self, context):
        catalog = Catalog()
        # text_indexer = NodeTextIndexer(["title"])
        # catalog[u"text"] = CatalogTextIndex(text_indexer)
        vote_indexer = NodeAttributeIndexer("vote")
        catalog[u"vote"] = CatalogFieldIndex(vote_indexer)
        return catalog
