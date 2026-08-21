# Delplanche transactional email templates

Three standalone HTML templates, table-based for mail-client compatibility with
inline styles that mirror the site's design language:

- warm neutral canvas `#F5F2EC`, card `#FBFAF7`
- ebony ink `#2C3E35`, muted ink `#6F7A72`, moss accent `#5C7A66`
- monospace metadata (`ui-monospace, SFMono-Regular, Menlo, monospace`)
- serif headings (`Georgia, 'Times New Roman', serif`)
- 1px gridlines, 8px rounded cards, generous vertical spacing

Placeholders use `{{double_braces}}`:
`{{client_name}}`, `{{company}}`, `{{domain}}`, `{{ticket_ref}}`,
`{{received_at}}`, `{{message_excerpt}}`, `{{window_start}}`, `{{window_end}}`,
`{{panel_url}}`, `{{webmail_url}}`, `{{docs_url}}`, `{{contact_url}}`,
`{{node_name}}`, `{{ip_address}}`, `{{deployed_at}}`.

Files:
- `onboarding-welcome.html` — client onboarding & setup initiation
- `contact-autoreply.html` — secure contact auto-reply
- `deployment-complete.html` — technical handoff / deployment complete
