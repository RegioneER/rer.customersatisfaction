from Products.Five import BrowserView


class View(BrowserView):
    def __call__(self):
        import pdb

        pdb.set_trace()

