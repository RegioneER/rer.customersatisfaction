export const getCustomerSatisfactionLables = getTranslationFor => {
  return {
    page: getTranslationFor('page_label', 'Page'),
    ok: getTranslationFor('positive_votes_label', 'Positive votes'),
    nok: getTranslationFor('negative_votes_label', 'Negative votes'),
    last_voted: getTranslationFor('last_voted_label', 'Last voted'),
    comments: getTranslationFor('comments_label', 'Comments'),
    filterTitle: getTranslationFor('filter_title_label', 'Filter title'),
    search: getTranslationFor('search_label', 'Search...'),
    noData: getTranslationFor(
      'no_data_label',
      'No customer satisfaction data found',
    ),
    deleteFeedbacks: getTranslationFor(
      'delete_feedbacks_label',
      'Delete all feedbacks',
    ),
    deleteFeedbacksConfirm: getTranslationFor(
      'delete_feedbacks_confirm_label',
      'Are you sure you want to delete all feedbacks?',
    ),
    exportCsv: getTranslationFor('export_csv_label', 'Export in CSV'),
    singularSelected: getTranslationFor('item_selected', 'item selected'),
    pluralSelected: getTranslationFor('items_selected', 'items selected'),
    resetFeedbacksConfirm: getTranslationFor(
      'reset_feedbacks_confirm_label',
      "Are you sure you want to reset this page's feedbacks?",
    ),
    resetFeedbacksButton: getTranslationFor(
      'reset_feedbacks_label',
      'Reset feedbacks',
    ),
    rowsPerPageText: getTranslationFor('rows_per_page_label', 'Rows per page:'),
    rangeSeparatorText: getTranslationFor('range_separator_label', 'of'),
  };
};
