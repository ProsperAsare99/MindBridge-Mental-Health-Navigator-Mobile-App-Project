import re

with open('app/(tabs)/explore.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace raw hex colors in DATA arrays with accent keys
replacements = [
    ("'#06B6D4'", "'powderBlue'"),
    ("'#10B981'", "'softMint'"),
    ("'#F59E0B'", "'sand'"),
    ("'#8B5CF6'", "'softLilac'"),
    ("'#6366F1'", "'slate'"),
    ("'#F97316'", "'gentlePeach'"),
    ("'#EF4444'", "'terracotta'"),
    ("'#EC4899'", "'dustyRose'"),
    ("['#6366F1', '#8B5CF6']", "['slate', 'softLilac']"), # For FEATURED.color
    ("['#EA580C', '#C2410C']", "['terracotta', 'terracotta']"),
    ("['#7C3AED', '#6D28D9']", "['softLilac', 'softLilac']"),
    ("['#059669', '#047857']", "['mossVelvet', 'mossVelvet']"),
    ("['#4F46E5', '#4338CA']", "['slate', 'slate']"),
    ("['#D97706', '#B45309']", "['sand', 'sand']"),
    ("['#DB2777', '#BE185D']", "['dustyRose', 'dustyRose']"),
]

for old, new in replacements:
    content = content.replace(old, new)

# 2. Update Modals to use item.color (Audio, Article, Technique)
# In AudioPlayerModal
content = content.replace("{ backgroundColor: meditation.color + '20' }", "{ backgroundColor: (theme.colors.accents[meditation.color as keyof typeof theme.colors.accents] || theme.colors.plum) + '20' }")
content = content.replace("{ color: meditation.color }", "{ color: theme.colors.accents[meditation.color as keyof typeof theme.colors.accents] || theme.colors.plum }")
content = content.replace("backgroundColor: theme.colors.plum + '20'", "backgroundColor: (theme.colors.accents[meditation.color as keyof typeof theme.colors.accents] || theme.colors.plum) + '20'")
content = content.replace("IconComponent color={theme.colors.plum}", "IconComponent color={theme.colors.accents[meditation?.color as keyof typeof theme.colors.accents] || theme.colors.plum}")

# In ArticleModal
content = content.replace("{ backgroundColor: theme.colors.plum + '15' }", "{ backgroundColor: (theme.colors.accents[article.color as keyof typeof theme.colors.accents] || theme.colors.plum) + '15' }")
content = content.replace("{ color: theme.colors.plum }>{article.category}", "{ color: theme.colors.accents[article.color as keyof typeof theme.colors.accents] || theme.colors.plum }>{article.category}")
content = content.replace("{ backgroundColor: theme.colors.plum + '10' }", "{ backgroundColor: (theme.colors.accents[article.color as keyof typeof theme.colors.accents] || theme.colors.plum) + '10' }")
content = content.replace("IconComponent color={theme.colors.plum} size={32}", "IconComponent color={theme.colors.accents[article.color as keyof typeof theme.colors.accents] || theme.colors.plum} size={32}")

# In TechniqueModal
content = content.replace("{ backgroundColor: theme.colors.plum + '15' }", "{ backgroundColor: (theme.colors.accents[technique.color as keyof typeof theme.colors.accents] || theme.colors.plum) + '15' }")
content = content.replace("{ color: theme.colors.plum }>{technique.tag}", "{ color: theme.colors.accents[technique.color as keyof typeof theme.colors.accents] || theme.colors.plum }>{technique.tag}")
content = content.replace("{ backgroundColor: theme.colors.plum + '10' }", "{ backgroundColor: (theme.colors.accents[technique.color as keyof typeof theme.colors.accents] || theme.colors.plum) + '10' }")
content = content.replace("IconComponent color={theme.colors.plum} size={32}", "IconComponent color={theme.colors.accents[technique.color as keyof typeof theme.colors.accents] || theme.colors.plum} size={32}")

# 3. Update UI renderings
# Techniques list
content = content.replace("backgroundColor: theme.colors.plum + '10'", "backgroundColor: (theme.colors.accents[t.color as keyof typeof theme.colors.accents] || theme.colors.plum) + '10'")
content = content.replace("IconComponent color={theme.colors.plum} size={22}", "IconComponent color={theme.colors.accents[t.color as keyof typeof theme.colors.accents] || theme.colors.plum} size={22}")
content = content.replace("color: theme.colors.plum }]}>Learn More", "color: theme.colors.accents[t.color as keyof typeof theme.colors.accents] || theme.colors.plum }]}>Learn More")

# Articles list
content = content.replace("backgroundColor: theme.colors.plum + '10'", "backgroundColor: (theme.colors.accents[article.color as keyof typeof theme.colors.accents] || theme.colors.plum) + '10'")
content = content.replace("IconComponent color={theme.colors.plum} size={18}", "IconComponent color={theme.colors.accents[article.color as keyof typeof theme.colors.accents] || theme.colors.plum} size={18}")

# Guided Meditations
content = content.replace("backgroundColor: theme.colors.plum + '10'", "backgroundColor: (theme.colors.accents[med.color as keyof typeof theme.colors.accents] || theme.colors.plum) + '10'")
content = content.replace("IconComponent color={theme.colors.plum} size={24}", "IconComponent color={theme.colors.accents[med.color as keyof typeof theme.colors.accents] || theme.colors.plum} size={24}")

# Podcasts
content = content.replace("backgroundColor: theme.colors.plum + '10'", "backgroundColor: (theme.colors.accents[pod.color as keyof typeof theme.colors.accents] || theme.colors.plum) + '10'")
content = content.replace("IconComponent color={theme.colors.plum} size={20}", "IconComponent color={theme.colors.accents[pod.color as keyof typeof theme.colors.accents] || theme.colors.plum} size={20}")

# Videos (We'll just map the thumbnail to the accent color)
content = content.replace("colors={[theme.colors.plum, theme.colors.plum]}", "colors={[theme.colors.accents[vid.thumbnailColor[0] as keyof typeof theme.colors.accents] || theme.colors.plum, theme.colors.accents[vid.thumbnailColor[1] as keyof typeof theme.colors.accents] || theme.colors.plum]}")

# Quick Tools
qt_pattern = re.compile(r"(<Wind color=\{)theme\.colors\.plum(\} size=\{26\} />.*?Box Breathing)", re.DOTALL)
content = qt_pattern.sub(r"\1theme.colors.accents.powderBlue\2", content)

qt_pattern2 = re.compile(r"(<Compass color=\{)theme\.colors\.plum(\} size=\{26\} />.*?5-4-3-2-1 Grounding)", re.DOTALL)
content = qt_pattern2.sub(r"\1theme.colors.accents.softMint\2", content)

qt_pattern3 = re.compile(r"(<BookOpen color=\{)theme\.colors\.plum(\} size=\{26\} />.*?Reflective Journal)", re.DOTALL)
content = qt_pattern3.sub(r"\1theme.colors.accents.softLilac\2", content)

qt_pattern4 = re.compile(r"(<Activity color=\{)theme\.colors\.plum(\} size=\{26\} />.*?Self-Assessment)", re.DOTALL)
content = qt_pattern4.sub(r"\1theme.colors.accents.gentlePeach\2", content)

with open('app/(tabs)/explore.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated explore.tsx with soft accent colors!')
