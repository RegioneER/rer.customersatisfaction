Changelog
=========


2.2.4 (2023-07-07)
------------------

- add escape chars for csv in the customer-satisfaction-gloabal view.
  [folix-01]


2.2.3 (2023-05-25)
------------------
- Add export to customer-satisfaction-global view
  [folix-01]
- Add Spanish translations.
  [macagua]
- Fix english translations.
  [cekk]
- Fix bundle (there was a missing resource).
  [cekk]


2.2.2 (2023-05-11)
------------------

- Fix uninstall profile (remove action and bundles).
  [cekk]


2.2.1 (2023-03-24)
------------------
- Add customer-satisfaction-global view
  [folix-01]
- Fix english label.
  [cekk]


2.2.0 (2023-03-06)
------------------

- Fire content rules event on new vote.
  [ksuess]


2.1.1 (2022-12-30)
------------------

- Fix permissions to access feedbacks view.
  [cekk]


2.1.0 (2022-12-15)
------------------

- Handle comments view (aka do not break) when a content is deleted but has some comments.
  [cekk]
- Some fixes in accessibility and styles.
  [cekk]

2.0.0 (2022-11-07)
------------------

- Fix translations.
  [cekk]
- Fix python3.8 compatibility (https://github.com/repoze/repoze.catalog/issues/13) using python operators instead CQE.
  [cekk]
- Some fixes in layout.
  [cekk]
- Do not use recaptcha, but honeypot to prevent bots.
  [cekk]
- Remove role="radio" from labels to improve accessibility.
  [cekk]

1.2.0 (2022-07-06)
------------------

- Add a flag to disable captcha validation.
  [cekk]


1.1.2 (2021-12-27)
------------------

- Do not break viewlet if collective.recaptcha is not installed.
  [cekk]


1.1.1 (2021-12-02)
------------------

- Fix python requirement.
  [cekk]

1.1.0 (2021-10-22)
------------------

- A11y fixes [nzambello]
- Conditional use of collective.recaptcha.
  [cekk]


1.0.0 (2021-08-19)
------------------

- Initial release.
  [cekk]
