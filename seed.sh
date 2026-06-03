#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Praprika Sanity Seed Script
# Usage: SANITY_PROJECT_ID=xxx SANITY_TOKEN=yyy bash seed.sh
#
# Prerequisites: curl, jq
# Install jq: sudo apt-get install jq  OR  brew install jq
# ─────────────────────────────────────────────────────────────────────────────

set -e

PROJECT_ID="${SANITY_PROJECT_ID:-${NEXT_PUBLIC_SANITY_PROJECT_ID}}"
TOKEN="${SANITY_TOKEN:-${SANITY_API_TOKEN}}"
DATASET="${SANITY_DATASET:-production}"
API="https://${PROJECT_ID}.api.sanity.io/v2026-01-01/data"

if [[ -z "$PROJECT_ID" || -z "$TOKEN" ]]; then
  echo "❌ Set SANITY_PROJECT_ID and SANITY_TOKEN environment variables"
  echo "   Example: SANITY_PROJECT_ID=abc123 SANITY_TOKEN=sk... bash seed.sh"
  exit 1
fi

echo "🌱 Seeding Praprika Sanity dataset: ${DATASET}"
echo "   Project: ${PROJECT_ID}"
echo ""

# ─── Helper: create document ──────────────────────────────────────────────────
create_doc() {
  local doc="$1"
  curl -s -X POST \
    "${API}/mutate/${DATASET}?returnIds=true" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"mutations\":[{\"createOrReplace\":${doc}}]}" | jq -r '.results[0].id // .error.description'
}

# ─── Helper: upload image from URL with fallbacks ────────────────────────────
# Usage: upload_image "filename" "url1" "url2" "url3" ...
# Returns the Sanity asset _id, or empty string if all sources fail.
# A failed image will NOT stop the script — the item is created without one.
upload_image() {
  local filename="$1"
  shift
  local urls=("$@")
  local tmpfile
  tmpfile=$(mktemp /tmp/praprika_img_XXXXXX.jpg)

  for url in "${urls[@]}"; do
    echo "  📸 Trying image source for '${filename}': ${url}" >&2
    local http_code
    http_code=$(curl -sL --max-time 15 -w "%{http_code}" "$url" -o "$tmpfile" 2>/dev/null)
    local file_size
    file_size=$(wc -c < "$tmpfile" 2>/dev/null || echo 0)

    if [[ "$http_code" == "200" && "$file_size" -gt 5000 ]]; then
      # Looks like a real image — upload it
      local asset_id
      asset_id=$(curl -s -X POST \
        "https://${PROJECT_ID}.api.sanity.io/v2026-01-01/assets/images/${DATASET}" \
        -H "Authorization: Bearer ${TOKEN}" \
        -H "Content-Type: image/jpeg" \
        --data-binary "@${tmpfile}" | jq -r '.document._id // empty')
      rm -f "$tmpfile"
      if [[ -n "$asset_id" ]]; then
        echo "    ✅ Uploaded: ${asset_id}" >&2
        echo "$asset_id"
        return 0
      else
        echo "    ⚠️  Sanity upload failed for ${url}, trying next..." >&2
      fi
    else
      echo "    ⚠️  Download failed (HTTP ${http_code}, ${file_size} bytes) for ${url}, trying next..." >&2
    fi
  done

  rm -f "$tmpfile"
  echo "    ❌ All image sources failed for '${filename}' — item will be created without an image." >&2
  echo ""   # Return empty string
  return 0  # Don't abort the script
}

# ─── Helper: build image field JSON (omit entirely if no asset_id) ───────────
image_field() {
  local asset_id="$1"
  if [[ -n "$asset_id" ]]; then
    echo "\"image\":{\"_type\":\"image\",\"asset\":{\"_type\":\"reference\",\"_ref\":\"${asset_id}\"}}"
  else
    echo ""  # No image field
  fi
}

# ─── Helper: assemble menu item JSON, conditionally including image ───────────
menu_item_json() {
  # Args: _id name description price category_ref asset_id available featured
  local _id="$1" name="$2" description="$3" price="$4"
  local cat_ref="$5" asset_id="$6" available="$7" featured="$8"

  local img_fragment
  img_fragment=$(image_field "$asset_id")

  local comma_img=""
  if [[ -n "$img_fragment" ]]; then
    comma_img=",${img_fragment}"
  fi

  echo "{
    \"_type\":\"menuItem\",\"_id\":\"${_id}\",
    \"name\":\"${name}\",
    \"description\":\"${description}\",
    \"price\":${price},
    \"category\":{\"_type\":\"reference\",\"_ref\":\"${cat_ref}\"}
    ${comma_img},
    \"available\":${available},\"featured\":${featured}
  }"
}

# ─────────────────────────────────────────────────────────────────────────────
# STEP 1: Create Categories
# ─────────────────────────────────────────────────────────────────────────────
echo "📂 Creating categories..."

CAT_MAINS=$(create_doc '{
  "_type":"category","_id":"cat-mains",
  "name":"Mains","slug":{"_type":"slug","current":"mains"},
  "timeRestriction":"both","sortOrder":1,"emoji":"🍽️"
}')
echo "  ✅ Mains: $CAT_MAINS"

CAT_TRADITIONAL=$(create_doc '{
  "_type":"category","_id":"cat-traditional",
  "name":"Traditional Dishes","slug":{"_type":"slug","current":"traditional"},
  "timeRestriction":"both","sortOrder":2,"emoji":"🍲"
}')
echo "  ✅ Traditional: $CAT_TRADITIONAL"

CAT_COMBOS=$(create_doc '{
  "_type":"category","_id":"cat-combos",
  "name":"Express Combos","slug":{"_type":"slug","current":"combos"},
  "timeRestriction":"day","sortOrder":3,"emoji":"⚡"
}')
echo "  ✅ Express Combos: $CAT_COMBOS"

CAT_SMALL=$(create_doc '{
  "_type":"category","_id":"cat-small-plates",
  "name":"Small Plates","slug":{"_type":"slug","current":"small-plates"},
  "timeRestriction":"both","sortOrder":4,"emoji":"🍢"
}')
echo "  ✅ Small Plates: $CAT_SMALL"

CAT_GRILLS=$(create_doc '{
  "_type":"category","_id":"cat-grills",
  "name":"Grills","slug":{"_type":"slug","current":"grills"},
  "timeRestriction":"night","sortOrder":5,"emoji":"🔥"
}')
echo "  ✅ Grills: $CAT_GRILLS"

CAT_COCKTAILS=$(create_doc '{
  "_type":"category","_id":"cat-cocktails",
  "name":"Signature Cocktails","slug":{"_type":"slug","current":"cocktails"},
  "timeRestriction":"night","sortOrder":6,"emoji":"🍹"
}')
echo "  ✅ Cocktails: $CAT_COCKTAILS"

CAT_BOTTLES=$(create_doc '{
  "_type":"category","_id":"cat-bottles",
  "name":"Premium Bottles","slug":{"_type":"slug","current":"bottles"},
  "timeRestriction":"night","sortOrder":7,"emoji":"🥂"
}')
echo "  ✅ Premium Bottles: $CAT_BOTTLES"

CAT_DESSERTS=$(create_doc '{
  "_type":"category","_id":"cat-desserts",
  "name":"Desserts","slug":{"_type":"slug","current":"desserts"},
  "timeRestriction":"both","sortOrder":8,"emoji":"🍮"
}')
echo "  ✅ Desserts: $CAT_DESSERTS"

# ─────────────────────────────────────────────────────────────────────────────
# STEP 2: Upload images & create menu items
# Each upload_image call accepts multiple fallback URLs.
# A failed image does NOT stop the script.
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo "🖼️  Uploading images and creating menu items..."

# ── Mains ──
IMG_JOLLOF=$(upload_image "jollof-rice" \
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80" \
  "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80" \
  "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80")
DOC=$(menu_item_json "item-jollof" "Praprika Jollof Rice" \
  "Party-style smoky jollof with your choice of protein — chicken, beef, or fish" \
  4500 "cat-mains" "$IMG_JOLLOF" true true)
create_doc "$DOC" > /dev/null
echo "  ✅ Praprika Jollof Rice"

IMG_TILAPIA=$(upload_image "grilled-tilapia" \
  "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=800&q=80" \
  "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80" \
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80")
DOC=$(menu_item_json "item-tilapia" "Grilled Tilapia" \
  "Whole tilapia, peppered or plain, served with fried plantain and tomato sauce" \
  6500 "cat-mains" "$IMG_TILAPIA" true false)
create_doc "$DOC" > /dev/null
echo "  ✅ Grilled Tilapia"

IMG_FRIED_RICE=$(upload_image "fried-rice" \
  "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80" \
  "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80" \
  "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&q=80")
DOC=$(menu_item_json "item-fried-rice" "Fried Rice & Chicken" \
  "Nigerian-style fried rice with crispy fried chicken and coleslaw" \
  4800 "cat-mains" "$IMG_FRIED_RICE" true false)
create_doc "$DOC" > /dev/null
echo "  ✅ Fried Rice & Chicken"

# ── Traditional ──
IMG_POUNDED=$(upload_image "pounded-yam" \
  "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80" \
  "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80" \
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80")
DOC=$(menu_item_json "item-pounded-yam" "Pounded Yam & Egusi" \
  "Smooth pounded yam with rich egusi soup, assorted meat, and smoked fish" \
  5500 "cat-traditional" "$IMG_POUNDED" true true)
create_doc "$DOC" > /dev/null
echo "  ✅ Pounded Yam & Egusi"

IMG_PEPPER_SOUP=$(upload_image "pepper-soup" \
  "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80" \
  "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800&q=80" \
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80")
DOC=$(menu_item_json "item-catfish-pepper-soup" "Catfish Pepper Soup" \
  "Hot and spicy point-and-kill pepper soup — the midnight special" \
  6800 "cat-traditional" "$IMG_PEPPER_SOUP" true true)
create_doc "$DOC" > /dev/null
echo "  ✅ Catfish Pepper Soup"

IMG_AFANG=$(upload_image "afang-soup" \
  "https://images.unsplash.com/photo-1608835291093-394b0c943a75?w=800&q=80" \
  "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80" \
  "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80")
DOC=$(menu_item_json "item-afang" "Afang Soup & Semovita" \
  "Rich Efik afang with tender assorted meat and stockfish" \
  5800 "cat-traditional" "$IMG_AFANG" true false)
create_doc "$DOC" > /dev/null
echo "  ✅ Afang Soup & Semovita"

# ── Express Combos ──
IMG_COMBO=$(upload_image "lunch-combo" \
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80" \
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80" \
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80")
DOC=$(menu_item_json "item-corporate-combo" "Corporate Express Combo" \
  "Jollof rice + 1 protein + soft drink. Served in under 40 minutes." \
  3500 "cat-combos" "$IMG_COMBO" true true)
create_doc "$DOC" > /dev/null
echo "  ✅ Corporate Express Combo"

DOC=$(menu_item_json "item-continental-set" "Continental Lunch Set" \
  "Pasta or rice + garden salad + fresh juice. Light and quick." \
  3800 "cat-combos" "$IMG_COMBO" true false)
create_doc "$DOC" > /dev/null
echo "  ✅ Continental Lunch Set"

# ── Small Plates ──
IMG_WINGS=$(upload_image "chicken-wings" \
  "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80" \
  "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&q=80" \
  "https://images.unsplash.com/photo-1608835291093-394b0c943a75?w=800&q=80")
DOC=$(menu_item_json "item-wings" "Chicken Wings (8pcs)" \
  "Peppered, BBQ, or buffalo sauce — choose your heat level" \
  3200 "cat-small-plates" "$IMG_WINGS" true true)
create_doc "$DOC" > /dev/null
echo "  ✅ Chicken Wings"

IMG_SPRING=$(upload_image "spring-rolls" \
  "https://images.unsplash.com/photo-1548507050-f9e0e77a5b6a?w=800&q=80" \
  "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80" \
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80")
DOC=$(menu_item_json "item-spring-rolls" "Spring Rolls & Samosas" \
  "6pcs of each, served with chilli dipping sauce" \
  2800 "cat-small-plates" "$IMG_SPRING" true false)
create_doc "$DOC" > /dev/null
echo "  ✅ Spring Rolls & Samosas"

IMG_GIZZARD=$(upload_image "peppered-gizzard" \
  "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80" \
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80" \
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80")
DOC=$(menu_item_json "item-gizzard" "Peppered Gizzard" \
  "Slow-cooked, richly spiced Nigerian-style gizzard" \
  2500 "cat-small-plates" "$IMG_GIZZARD" true false)
create_doc "$DOC" > /dev/null
echo "  ✅ Peppered Gizzard"

# ── Grills ──
IMG_GRILL=$(upload_image "mixed-grill" \
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80" \
  "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80" \
  "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&q=80")
DOC=$(menu_item_json "item-mixed-grill" "Mixed Grill Platter" \
  "Beef suya, chicken, sausage and fried plantain on a sharing board" \
  9500 "cat-grills" "$IMG_GRILL" true true)
create_doc "$DOC" > /dev/null
echo "  ✅ Mixed Grill Platter"

IMG_SNAIL=$(upload_image "peppered-snail" \
  "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80" \
  "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800&q=80" \
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80")
DOC=$(menu_item_json "item-snail" "Peppered Snail" \
  "Giant Congo snail in rich pepper sauce — a Nigerian delicacy" \
  5500 "cat-grills" "$IMG_SNAIL" true false)
create_doc "$DOC" > /dev/null
echo "  ✅ Peppered Snail"

# ── Cocktails ──
IMG_COCKTAIL=$(upload_image "cocktail" \
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" \
  "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&q=80" \
  "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80")
DOC=$(menu_item_json "item-palm-wine-sangria" "Palm Wine Sangria" \
  "House-infused palm wine, tropical fruits, prosecco — uniquely Nigerian" \
  3500 "cat-cocktails" "$IMG_COCKTAIL" true true)
create_doc "$DOC" > /dev/null
echo "  ✅ Palm Wine Sangria"

DOC=$(menu_item_json "item-asaba-sunset" "Asaba Sunset" \
  "Coconut rum, passion fruit, ginger beer, burnt orange" \
  3200 "cat-cocktails" "$IMG_COCKTAIL" true false)
create_doc "$DOC" > /dev/null
echo "  ✅ Asaba Sunset"

IMG_MOCKTAIL=$(upload_image "zobo-cooler" \
  "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80" \
  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=800&q=80" \
  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80")
DOC=$(menu_item_json "item-zobo" "Virgin Zobo Cooler" \
  "House-made hibiscus, cloves, ginger, mint — refreshing non-alcoholic" \
  1800 "cat-cocktails" "$IMG_MOCKTAIL" true false)
create_doc "$DOC" > /dev/null
echo "  ✅ Virgin Zobo Cooler"

# ── Premium Bottles ──
IMG_HENNESSY=$(upload_image "hennessy" \
  "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&q=80" \
  "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80" \
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80")
DOC=$(menu_item_json "item-hennessy-vs" "Hennessy VS (70cl)" \
  "Served with ice bucket and 4 chasers of your choice" \
  28000 "cat-bottles" "$IMG_HENNESSY" true true)
create_doc "$DOC" > /dev/null
echo "  ✅ Hennessy VS"

DOC=$(menu_item_json "item-hennessy-vsop" "Hennessy VSOP (70cl)" \
  "Premium cognac, ice bucket, 4 chasers" \
  45000 "cat-bottles" "$IMG_HENNESSY" true false)
create_doc "$DOC" > /dev/null
echo "  ✅ Hennessy VSOP"

IMG_MOET=$(upload_image "moet" \
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" \
  "https://images.unsplash.com/photo-1546171753-97d7676e4602?w=800&q=80" \
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80")
DOC=$(menu_item_json "item-moet" "Moët & Chandon (75cl)" \
  "Chilled champagne, flutes, and fresh strawberries" \
  38000 "cat-bottles" "$IMG_MOET" true false)
create_doc "$DOC" > /dev/null
echo "  ✅ Moët & Chandon"

IMG_CIROC=$(upload_image "ciroc" \
  "https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=800&q=80" \
  "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&q=80" \
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80")
DOC=$(menu_item_json "item-ciroc" "Cîroc Vodka (70cl)" \
  "Any flavour, ice bucket, 4 chasers" \
  25000 "cat-bottles" "$IMG_CIROC" true false)
create_doc "$DOC" > /dev/null
echo "  ✅ Cîroc Vodka"

# ── Desserts ──
IMG_DESSERT=$(upload_image "lava-cake" \
  "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80" \
  "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80" \
  "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80")
DOC=$(menu_item_json "item-lava-cake" "Molten Lava Cake" \
  "Dark chocolate, vanilla bean ice cream, raspberry coulis" \
  3800 "cat-desserts" "$IMG_DESSERT" true true)
create_doc "$DOC" > /dev/null
echo "  ✅ Molten Lava Cake"

IMG_PUFF=$(upload_image "puff-puff" \
  "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80" \
  "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80" \
  "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80")
DOC=$(menu_item_json "item-puff-puff" "Puff Puff & Custard" \
  "Nigerian puff puff, warm vanilla custard, dusted with powdered sugar" \
  2200 "cat-desserts" "$IMG_PUFF" true false)
create_doc "$DOC" > /dev/null
echo "  ✅ Puff Puff & Custard"

# ─────────────────────────────────────────────────────────────────────────────
# STEP 3: Create a featured event
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo "🎵 Creating live event..."

create_doc '{
  "_type":"event","_id":"event-live-band-1",
  "title":"Live Band Night — The Rhythms of Delta",
  "date":"2025-06-07",
  "time":"8:00 PM",
  "tag":"Live Band",
  "description":"Join us for an electric evening of Afrobeats, Highlife & Soul. Reserve your VIP booth now before tables sell out.",
  "isFeatured":true
}' > /dev/null
echo "  ✅ Live Band Night event"

# ─────────────────────────────────────────────────────────────────────────────
# DONE
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo "────────────────────────────────────────────────────"
echo "✅ Seed complete!"
echo ""
echo "Next steps:"
echo "  1. Visit https://${PROJECT_ID}.sanity.studio to review content"
echo "  2. In Sanity Studio, review each menu item image (some"
echo "     Unsplash images may need replacing with actual Praprika photos)"
echo "  3. Update event dates to match real upcoming events"
echo "  4. Run: npm run dev"
echo "────────────────────────────────────────────────────"