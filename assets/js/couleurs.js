// Couleurs dynamiques des boutons

function getBestSwatch(swatches, targetContrast = 5) {
    // Ordre de priorité des palettes (on privilégie le vibrant/coloré)
    // const keys = ['Vibrant', 'LightMuted', 'DarkVibrant', 'Muted', 'DarkMuted', 'LightVibrant'];
    const keys = ['Vibrant', 'DarkVibrant', 'DarkMuted', 'Muted', 'LightVibrant', 'LightMuted'];

    // Étape A : On cherche le premier swatch qui respecte naturellement le contraste
    for (const key of keys) {
        const swatch = swatches[key];
        if (!swatch) continue;

        const contrastWhite = swatch.color.contrast.white;
        const contrastBlack = swatch.color.contrast.black;

        if (contrastWhite >= targetContrast) {
            return {swatch, isDark: true}; // Fond sombre -> Texte blanc
        } else if (contrastBlack >= targetContrast) {
            return {swatch, isDark: false}; // Fond clair -> Texte noir
        }
    }

    // Étape B : Repli de secours (si aucun swatch ne respecte le contraste)
    for (const key of keys) {
        const swatch = swatches[key];
        if (swatch) {
            const isDark = swatch.color.contrast.white >= swatch.color.contrast.black;
            return {swatch, isDark};
        }
    }
    return null;
}

function getBestHollowSwatch(swatches, targetContrast = 4.5) {
    // On privilégie les palettes sombres d'abord pour l'écriture sur fond blanc
    const keys = ['DarkVibrant', 'DarkMuted', 'Muted', 'Vibrant', 'LightVibrant', 'LightMuted'];

    for (const key of keys) {
        const swatch = swatches[key];
        if (!swatch) continue;

        if (swatch.color.contrast.white >= targetContrast) {
            return swatch;
        }
    }

    // Repli de secours
    for (const key of keys) {
        const swatch = swatches[key];
        if (swatch) return swatch;
    }
    return null;
}

async function extractColor() {
    if (typeof ColorThief === 'undefined') return;

    const articles = document.querySelectorAll('.concert-card');

    for (const article of articles) {
        const img = article.querySelector('.concert-poster');
        const btn = article.querySelector('.btn-primary');
        const btn_creux = article.querySelector('.btn-outline');

        if (!img) continue;

        try {
            const response = await fetch(img.src);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const tempImg = new Image();
            tempImg.crossOrigin = "Anonymous";
            tempImg.src = blobUrl;

            tempImg.onload = async () => {
                try {
                    const swatches = await ColorThief.getSwatches(tempImg);

                    // 1. Application au bouton plein
                    if (btn) {
                        const result = getBestSwatch(swatches);
                        console.log(result.swatch.color.contrast);
                        if (result) {
                            btn.style.backgroundColor = result.swatch.color.css();
                            if (result.isDark) {
                                btn.classList.add('texte-clair');
                                btn.classList.remove('texte-sombre');
                            } else {
                                btn.classList.add('texte-sombre');
                                btn.classList.remove('texte-clair');

                            }
                        }
                    }

                    // 2. Application au bouton creux
                    if (btn_creux) {
                        const swatchHollow = getBestSwatch(swatches);
                        if (swatchHollow) {
                            const colorCss = swatchHollow.swatch.color.css();
                            btn_creux.style.setProperty('border-color', colorCss, 'important');
                            // btn_creux.style.setProperty('color', colorCss, 'important');
                        }
                    }
                } catch (e) {
                    console.error("Erreur ColorThief :", e);
                } finally {
                    URL.revokeObjectURL(blobUrl);
                }
            };
        } catch (e) {
            console.error("Erreur téléchargement image :", e);
        }
    }
}

window.addEventListener('load', extractColor);
