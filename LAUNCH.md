# Launch checklist: moving southerntimberfloors.com to GitHub Pages

Work through this top to bottom. Nothing here changes the live site until **Step 5**.

---

## Step 1: Confirm control of the domain

- [ ] Log in to the Crazy Domains account and open **southerntimberfloors.com** (the `.com`, not `.com.au`).
  - Status **Active** with expiry **27 Oct 2028**: you control it. Continue.
  - Status **Transferred out / Inactive / Expired**: the domain now sits at **VentraIP** (public record as of Nov 2026). Ask the agency to push it to a VentraIP account in your family's name, or to provide the EPP/transfer code.
- [ ] Find out **where DNS is managed**. As of Nov 2026 the domain uses VentraIP's DNS servers (`ns1/ns2/ns3.nameserver.net.au`), so DNS records are edited in **that** account, not Crazy Domains, unless the nameservers are changed.
- [ ] Get **Administrator** access to Google Tag Manager (`GTM-5DLDXN6G`), Google Analytics (`G-R22YQ50297`) and **Owner** access to Google Search Console.
- [ ] Confirm you have a **global admin** login for Microsoft 365 (your email).

## Step 2: Connect the enquiry form

- [ ] Go to <https://web3forms.com>, enter the inbox that should receive enquiries (e.g. `enquiries@southerntimberfloors.com`) and copy the access key it emails you.
- [ ] Paste it into `formAccessKey` in `src/data/site.ts`. The key is safe to be public.
- [ ] `npm run build` should no longer print "Enquiry form not connected".

## Step 3: Publish to GitHub Pages (preview)

The code is already on GitHub at `deanmasc/southern-timber-flooring` (public). For a **project** repo like this, GitHub Pages serves the preview at `https://deanmasc.github.io/southern-timber-flooring/`. In that sub-folder the site's styles, photos and links won't load, because they expect to live at the root of a domain. That only affects the preview: once the custom domain is set, the site is served at the root and everything works.

Pick one way to get a working preview:

- **A. Business organisation (recommended):** create a free GitHub organisation (e.g. `southern-timber-floors`). In the repo: **Settings → General → Transfer ownership** to the organisation, then rename the repo to `southern-timber-floors.github.io`. Preview: `https://southern-timber-floors.github.io`. The site then belongs to the business, not a personal account.
- **B. Quick:** rename the repo to `deanmasc.github.io`. Preview: `https://deanmasc.github.io`.

GitHub redirects the old repo URL after a rename or transfer, so `git push` keeps working. You can also update it with `git remote set-url origin <new url>`.

Then:

- [ ] Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
- [ ] Push to `main` (or run the workflow from the **Actions** tab) and wait for a green tick.
- [ ] Open the preview, click through the site and send a **test enquiry**. It should arrive by email and show the Thanks page.
- [ ] Run the URL check against the preview:
  ```bash
  npm run verify:live -- https://<owner>.github.io
  ```
  All 112 URLs must be "served directly". If pages like `/about-us` or `/timber` show as **redirected** (a trailing-slash issue), stop. Host on Cloudflare Pages instead (see README); the code works there unchanged.

## Step 4: Verify the domain with GitHub (prevents domain takeover)

- [ ] GitHub → your organisation's (or personal account's) **Settings → Pages → Add a verified domain** → `southerntimberfloors.com`.
- [ ] Add the TXT record GitHub shows you in the DNS account (Step 1), then click **Verify**.

## Step 5: Switch DNS (go live)

Lower the TTL of the records below to 300 seconds a day before, if the DNS panel allows.

**Change these (website):**

| Type | Host | Old value | New value |
|---|---|---|---|
| A | `@` (bare domain) | `149.28.178.132` | `185.199.108.153` |
| A | `@` | n/a | `185.199.109.153` |
| A | `@` | n/a | `185.199.110.153` |
| A | `@` | n/a | `185.199.111.153` |
| A → **CNAME** | `www` | `149.28.178.132` (A record, delete it) | `<owner>.github.io` (e.g. `southern-timber-floors.github.io` or `deanmasc.github.io`) |

Optional IPv6 (AAAA on `@`): `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.

**Do NOT change these (Microsoft 365 email, Teams and device management).** If DNS moves to a different provider, recreate every one exactly:

| Type | Host | Value |
|---|---|---|
| MX | `@` | `southerntimberfloors-com.mail.protection.outlook.com` (priority 1) |
| TXT | `@` | `v=spf1 include:spf.protection.outlook.com -all` |
| TXT | `@` | `MS=ms55813229` |
| TXT | `_dmarc` | `v=DMARC1;p=quarantine;sp=none;adkim=r;aspf=r;pct=100;fo=0;rf=afrf;ri=86400` |
| CNAME | `autodiscover` | `autodiscover.outlook.com` |
| CNAME | `selector1._domainkey` | `selector1-southerntimberfloors-com._domainkey.stfloors.q-v1.dkim.mail.microsoft` |
| CNAME | `selector2._domainkey` | `selector2-southerntimberfloors-com._domainkey.stfloors.q-v1.dkim.mail.microsoft` |
| CNAME | `enterpriseregistration` | `enterpriseregistration.windows.net` |
| CNAME | `enterpriseenrollment` | `enterpriseenrollment-s.manage.microsoft.com` |
| CNAME | `lyncdiscover` | `webdir.online.lync.com` |
| CNAME | `sip` | `sipdir.online.lync.com` |
| SRV | `_sip._tls` | `100 1 443 sipdir.online.lync.com` |
| SRV | `_sipfederationtls._tcp` | `100 1 5061 sipfed.online.lync.com` |

This list was captured from public DNS in Nov 2026. Ask for the full zone export anyway, in case there are records public lookups can't see.

**Then in GitHub:**

- [ ] Repo **Settings → Pages → Custom domain** → `www.southerntimberfloors.com` → Save.
- [ ] When the DNS check passes (minutes to a few hours), tick **Enforce HTTPS**.

## Step 6: Confirm it's live

- [ ] `npm run verify:live` should report all ✓ (112 URLs, sitemap, 404, bare→www, http→https).
- [ ] Send a test enquiry from the live site.
- [ ] Send and receive an email at `enquiries@…` to confirm mail still works.
- [ ] Google Search Console → **Sitemaps** → submit `https://www.southerntimberfloors.com/sitemap.xml`.

## Step 7: After launch

- [ ] In Crazy Domains, forward **southerntimberfloors.com.au** (and other variations) to `https://www.southerntimberfloors.com` as a **permanent (301)** redirect.
- [ ] Watch Search Console **Pages** and **404** reports weekly for 2–4 weeks.
- [ ] Optional: in Web3Forms, restrict submissions to `southerntimberfloors.com`.
- [ ] Once everything has checked out for a week or two, **cancel the agency's hosting** (check the contract's notice period).
