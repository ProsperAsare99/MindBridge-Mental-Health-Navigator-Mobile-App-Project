import re

with open('app/(tabs)/explore.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(len(lines)):
    line = lines[i]
    
    # AudioPlayerModal (around line 720)
    # The errors say they are around 788 for article.color in ArticleModal.
    # We will just fix based on function scope.
    
    if "const AudioPlayerModal =" in line:
        current_modal = "AudioPlayerModal"
    elif "const ArticleModal =" in line:
        current_modal = "ArticleModal"
    elif "const TechniqueModal =" in line:
        current_modal = "TechniqueModal"
    elif "const showTechniques =" in line:
        current_modal = "MainScreen"

for i in range(len(lines)):
    line = lines[i]
    
    # 788: error TS2304: Cannot find name 'meditation'. (Inside ArticleModal)
    if "IconComponent color={theme.colors.accents[meditation?.color as keyof typeof theme.colors.accents]" in line:
        # Check if inside ArticleModal (near 788) or TechniqueModal (near 825)
        if 780 < i < 800:
            lines[i] = line.replace("meditation?.color", "article.color")
        elif 810 < i < 840:
            lines[i] = line.replace("meditation?.color", "technique.color")
            
    # 818, 824, 837: Cannot find name 'article'. (Inside TechniqueModal)
    if "article.color as keyof typeof theme.colors.accents" in line:
        if 805 < i < 850:
            lines[i] = line.replace("article.color", "technique.color")
            
    # Now for the ones in the main list:
    # 985, 999: Cannot find name 'article'. (Inside FEATURED block)
    if 980 < i < 1010:
        lines[i] = line.replace("theme.colors.accents[article.color as keyof typeof theme.colors.accents] || ", "")

    # 1063, 1064, 1077: (Inside Techniques List)
    if 1050 < i < 1090:
        if "article.color" in line:
            lines[i] = line.replace("article.color", "t.color")
        if "meditation?.color" in line:
            lines[i] = line.replace("meditation?.color", "t.color")

    # 1151: Cannot find name 'meditation'. (Inside Articles List)
    if 1130 < i < 1170:
        if "meditation?.color" in line:
            lines[i] = line.replace("meditation?.color", "article.color")
            
    # 1200, 1201: Cannot find name 'article' and 'meditation' (Inside Audio Section - GUIDED_MEDITATIONS)
    if 1180 < i < 1220:
        if "article.color" in line:
            lines[i] = line.replace("article.color", "med.color")
        if "meditation?.color" in line:
            lines[i] = line.replace("meditation?.color", "med.color")
            
    # 1241, 1242: Cannot find name 'article' and 'meditation' (Inside Audio Section - SOUNDSCAPES)
    if 1220 < i < 1260:
        if "article.color" in line:
            lines[i] = line.replace("article.color", "med.color")
        if "meditation?.color" in line:
            lines[i] = line.replace("meditation?.color", "med.color")

    # 1283: Cannot find name 'meditation' (Inside Podcasts Section)
    if 1270 < i < 1300:
        if "meditation?.color" in line:
            lines[i] = line.replace("meditation?.color", "pod.color")

    # 1333, 1334, 1340: Cannot find name 'article', 'meditation' (Inside Crisis Resources)
    if 1320 < i < 1360:
        if "article.color" in line:
            lines[i] = line.replace("theme.colors.accents[article.color as keyof typeof theme.colors.accents] || theme.colors.plum", "theme.colors.plum")
        if "meditation?.color" in line:
            lines[i] = line.replace("theme.colors.accents[meditation?.color as keyof typeof theme.colors.accents] || theme.colors.plum", "theme.colors.plum")

with open('app/(tabs)/explore.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Fixed explore.tsx variable scopes')
