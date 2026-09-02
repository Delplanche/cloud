#!/usr/bin/env python3
"""Genereert per pagina en per taal een Open Graph banner (1200x630).

Gebruikt uitsluitend het echte merk: wordmark, huisfonts en huiskleuren.
Uitvoer: public/og/<page>-<locale>.jpg
"""

import os
import glob
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "og")
TMP = "/tmp/og-fonts"

CANVAS = (245, 243, 239)
EBONY = (28, 29, 31)
MOSS = (42, 71, 54)
TERRA = (194, 109, 82)
MUTED = (120, 118, 112)

W, H = 1200, 630


def fonts():
    os.makedirs(TMP, exist_ok=True)
    for f in glob.glob(os.path.join(ROOT, "public", "fonts", "*.woff2")):
        out = os.path.join(TMP, os.path.basename(f).replace(".woff2", ".ttf"))
        if not os.path.exists(out):
            t = TTFont(f)
            t.flavor = None
            t.save(out)
    return (
        os.path.join(TMP, "instrument-serif-latin.ttf"),
        os.path.join(TMP, "inter-latin.ttf"),
        os.path.join(TMP, "jetbrains-mono-latin.ttf"),
    )


SERIF, SANS, MONO = fonts()


def wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=font) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def tracked(draw, xy, text, font, fill, tracking):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking


def banner(page, locale, eyebrow, title, subtitle, accent):
    img = Image.new("RGB", (W, H), CANVAS)
    d = ImageDraw.Draw(img)

    # Zwitsers raster
    for x in range(0, W, 40):
        d.line([(x, 0), (x, H)], fill=(233, 230, 224), width=1)
    for y in range(0, H, 40):
        d.line([(0, y), (W, y)], fill=(233, 230, 224), width=1)

    # Kaderlijnen
    d.rectangle([48, 48, W - 49, H - 49], outline=(216, 212, 204), width=1)
    d.rectangle([0, 0, W - 1, 10], fill=accent)

    m = 96
    logo = Image.open(os.path.join(ROOT, "public", "logo.png")).convert("RGBA")
    lw = 260
    lh = int(logo.height * lw / logo.width)
    img.paste(logo.resize((lw, lh), Image.LANCZOS), (m, 92), logo.resize((lw, lh), Image.LANCZOS))

    f_mono = ImageFont.truetype(MONO, 17)
    f_serif = ImageFont.truetype(SERIF, 76)
    f_sans = ImageFont.truetype(SANS, 24)
    f_foot = ImageFont.truetype(MONO, 16)

    tracked(d, (m, 92 + lh + 34), eyebrow.upper(), f_mono, accent, 2.6)

    y = 92 + lh + 84
    for line in wrap(d, title, f_serif, W - 2 * m)[:2]:
        d.text((m, y), line, font=f_serif, fill=EBONY)
        y += 86

    d.line([(m, y + 14), (m + 96, y + 14)], fill=accent, width=3)

    y += 48
    for line in wrap(d, subtitle, f_sans, W - 2 * m - 40)[:2]:
        d.text((m, y), line, font=f_sans, fill=MUTED)
        y += 36

    d.line([(m, H - 116), (W - m, H - 116)], fill=(216, 212, 204), width=1)
    tracked(d, (m, H - 96), "DELPLANCHE.CLOUD", f_foot, EBONY, 2.4)
    right = "GENÈVE · CH  //  " + locale.upper()
    wpx = sum(d.textlength(c, font=f_foot) + 2.4 for c in right)
    tracked(d, (W - m - wpx, H - 96), right, f_foot, MUTED, 2.4)

    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, f"{page}-{locale}.jpg")
    img.save(path, "JPEG", quality=92, optimize=True, progressive=True)
    return path


PAGES = {
    "home": {
        "accent": MOSS,
        "en": ("Sovereign cloud architecture", "Sovereign Cloud Architecture", "Swiss hosting, VPS and kSuite under FADP protection, powered by hydroelectricity."),
        "nl": ("Soevereine cloudarchitectuur", "Soevereine Cloudarchitectuur", "Zwitserse hosting, VPS en kSuite onder FADP-bescherming, gevoed door waterkracht."),
        "fr": ("Architecture cloud souveraine", "Architecture Cloud Souveraine", "Hébergement, VPS et kSuite suisses sous protection LPD, alimentés par l'hydroélectricité."),
    },
    "stack": {
        "accent": MOSS,
        "en": ("01 / Stack", "Architecture Specifications", "Jurisdiction, energy, egress and PUE measured against US hyperscalers."),
        "nl": ("01 / Infrastructuur", "Architectuurspecificaties", "Jurisdictie, energie, egress en PUE gemeten tegenover Amerikaanse hyperscalers."),
        "fr": ("01 / Infrastructure", "Spécifications d'architecture", "Juridiction, énergie, egress et PUE comparés aux hyperscalers américains."),
    },
    "security": {
        "accent": EBONY,
        "en": ("02 / Security", "Compliance & Swiss Jurisdiction", "FADP protection, Cloud Act immunity, ISO certification, AES-256 and TLS 1.3."),
        "nl": ("02 / Beveiliging", "Compliance & Zwitserse Jurisdictie", "FADP-bescherming, Cloud Act-immuniteit, ISO-certificering, AES-256 en TLS 1.3."),
        "fr": ("02 / Sécurité", "Conformité & Juridiction Suisse", "Protection LPD, immunité au Cloud Act, certifications ISO, AES-256 et TLS 1.3."),
    },
    "onboarding": {
        "accent": TERRA,
        "en": ("03 / Onboarding", "Infrastructure Request", "DNS, SSL, mail and web server fully configured within 24 hours."),
        "nl": ("03 / Onboarding", "Infrastructuuraanvraag", "DNS, SSL, mail en webserver volledig geconfigureerd binnen 24 uur."),
        "fr": ("03 / Intégration", "Demande d'infrastructure", "DNS, SSL, messagerie et serveur web configurés en moins de 24 heures."),
    },
    "contact": {
        "accent": TERRA,
        "en": ("04 / Contact", "Direct Contact & Verification", "Secure form, encrypted mail, Matrix protocol and PGP verification. Zero tracking."),
        "nl": ("04 / Contact", "Direct Contact & Verificatie", "Beveiligd formulier, versleutelde mail, Matrix-protocol en PGP-verificatie. Nul tracking."),
        "fr": ("04 / Contact", "Contact Direct & Vérification", "Formulaire sécurisé, courriel chiffré, protocole Matrix et vérification PGP."),
    },
    "faq": {
        "accent": MOSS,
        "en": ("Reference", "FAQ & Migration Guide", "Answers on migration, downtime, billing and Swiss data residency."),
        "nl": ("Naslag", "FAQ & Migratiegids", "Antwoorden over migratie, downtime, facturatie en Zwitserse dataresidentie."),
        "fr": ("Référence", "FAQ & Guide de Migration", "Réponses sur la migration, l'interruption, la facturation et la résidence des données."),
    },
    "gateway": {
        "accent": EBONY,
        "en": ("Access", "Client Gateway", "Direct entry points to your mail, drive, control panel and support desk."),
        "nl": ("Toegang", "Client Gateway", "Directe toegang tot je mail, drive, controlepaneel en supportdesk."),
        "fr": ("Accès", "Portail Client", "Accès direct à votre messagerie, drive, panneau de contrôle et support."),
    },
    "legal": {
        "accent": EBONY,
        "en": ("Legal", "Legal Impressum", "Publisher identification, jurisdiction and liability statement."),
        "nl": ("Juridisch", "Juridisch Impressum", "Identificatie van de uitgever, jurisdictie en aansprakelijkheid."),
        "fr": ("Juridique", "Mentions Légales", "Identification de l'éditeur, juridiction et responsabilité."),
    },
    "privacy": {
        "accent": MOSS,
        "en": ("Privacy", "Zero-Tracking Policy", "No tracking cookies, no marketing pixels, transparent affiliate accounting."),
        "nl": ("Privacy", "Zero-Tracking Beleid", "Geen trackingcookies, geen marketingpixels, transparante affiliate-verantwoording."),
        "fr": ("Confidentialité", "Politique Zéro Traçage", "Aucun cookie de suivi, aucun pixel marketing, transparence sur les commissions."),
    },
    "cloud": {
        "accent": MOSS,
        "en": ("Cloud services", "Curated Swiss Cloud", "Hosting, VPS, bare-metal and kSuite selected for sovereignty and uptime."),
        "nl": ("Clouddiensten", "Gecureerde Zwitserse Cloud", "Hosting, VPS, bare-metal en kSuite geselecteerd op soevereiniteit en uptime."),
        "fr": ("Services cloud", "Cloud Suisse Sélectionné", "Hébergement, VPS, bare-metal et kSuite choisis pour la souveraineté et la disponibilité."),
    },
}

if __name__ == "__main__":
    made = []
    for page, cfg in PAGES.items():
        for locale in ("en", "nl", "fr"):
            eyebrow, title, sub = cfg[locale]
            made.append(banner(page, locale, eyebrow, title, sub, cfg["accent"]))
    print(f"{len(made)} banners generated in public/og/")
