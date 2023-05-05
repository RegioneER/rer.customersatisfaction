const commentsDataAggregator = (data) => {
  return new Promise((resolve, reject) => {
    let result = [];

    try {
      if (!data) {
        resolve([]);
      }
      data.forEach(element => {
        element.items.forEach(content => {
          result.push(
            {
              siteId: element.siteId,
              siteUrl: element.siteUrl,
              comments: content.comments,
              last_vote: content.last_vote,
              ok: content.ok,
              nok: content.nok,
              contentTitle: content.title,
              contentUrl: content.url,
              contentUID: content.uid
            }
          )
        })
      });
    } catch (e) {
      reject(e)
    } finally {
      resolve(result);
    }

  })
};

export { commentsDataAggregator };
