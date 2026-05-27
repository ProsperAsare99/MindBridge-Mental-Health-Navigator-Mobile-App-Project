import re

with open('app/(tabs)/explore.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Modal specific bad replacements

# In AudioPlayerModal
# Find AudioPlayerModal block
audio_start = content.find('const AudioPlayerModal =')
audio_end = content.find('const ArticleModal =')
if audio_start != -1 and audio_end != -1:
    block = content[audio_start:audio_end]
    # Replace any article.color or technique.color with meditation.color
    block = re.sub(r'article\.color', 'meditation?.color', block)
    block = re.sub(r'technique\.color', 'meditation?.color', block)
    block = re.sub(r't\.color', 'meditation?.color', block)
    content = content[:audio_start] + block + content[audio_end:]

# In ArticleModal
article_start = content.find('const ArticleModal =')
article_end = content.find('const TechniqueModal =')
if article_start != -1 and article_end != -1:
    block = content[article_start:article_end]
    block = re.sub(r'meditation\?\.color', 'article.color', block)
    block = re.sub(r'technique\.color', 'article.color', block)
    block = re.sub(r't\.color', 'article.color', block)
    content = content[:article_start] + block + content[article_end:]

# In TechniqueModal
tech_start = content.find('const TechniqueModal =')
tech_end = content.find('// ─── MAIN SCREEN')
if tech_start != -1 and tech_end != -1:
    block = content[tech_start:tech_end]
    block = re.sub(r'meditation\?\.color', 'technique.color', block)
    block = re.sub(r'article\.color', 'technique.color', block)
    block = re.sub(r't\.color', 'technique.color', block)
    content = content[:tech_start] + block + content[tech_end:]

# In Main Screen
main_start = content.find('const showTechniques = activeCategory')
if main_start != -1:
    block = content[main_start:]
    
    # Fix Featured (should use FEATURED.color)
    feat_start = block.find('featuredBadge')
    feat_end = block.find('Techniques Section')
    if feat_start != -1 and feat_end != -1:
        feat_block = block[feat_start:feat_end]
        feat_block = re.sub(r'theme\.colors\.accents\[.*?\] \|\| theme\.colors\.plum', 'theme.colors.plum', feat_block)
        block = block[:feat_start] + feat_block + block[feat_end:]
        
    # Fix Techniques List (should use t.color)
    tech_list_start = block.find('TECHNIQUES.map((t')
    tech_list_end = block.find('Quick Tools')
    if tech_list_start != -1 and tech_list_end != -1:
        tech_block = block[tech_list_start:tech_list_end]
        tech_block = re.sub(r'article\.color', 't.color', tech_block)
        tech_block = re.sub(r'meditation\?\.color', 't.color', tech_block)
        tech_block = re.sub(r'med\.color', 't.color', tech_block)
        block = block[:tech_list_start] + tech_block + block[tech_list_end:]
        
    # Fix Articles List (should use article.color)
    art_list_start = block.find('ARTICLES.map((article')
    art_list_end = block.find('Audio Section')
    if art_list_start != -1 and art_list_end != -1:
        art_block = block[art_list_start:art_list_end]
        art_block = re.sub(r't\.color', 'article.color', art_block)
        art_block = re.sub(r'meditation\?\.color', 'article.color', art_block)
        art_block = re.sub(r'med\.color', 'article.color', art_block)
        block = block[:art_list_start] + art_block + block[art_list_end:]
        
    # Fix Guided Meditations (should use med.color)
    med_list_start = block.find('GUIDED_MEDITATIONS.map((med')
    med_list_end = block.find('Podcasts Section')
    if med_list_start != -1 and med_list_end != -1:
        med_block = block[med_list_start:med_list_end]
        med_block = re.sub(r't\.color', 'med.color', med_block)
        med_block = re.sub(r'article\.color', 'med.color', med_block)
        med_block = re.sub(r'meditation\?\.color', 'med.color', med_block)
        block = block[:med_list_start] + med_block + block[med_list_end:]
        
    # Fix Podcasts (should use pod.color)
    pod_list_start = block.find('PODCAST_RESOURCES.map((pod')
    pod_list_end = block.find('Videos Section')
    if pod_list_start != -1 and pod_list_end != -1:
        pod_block = block[pod_list_start:pod_list_end]
        pod_block = re.sub(r't\.color', 'pod.color', pod_block)
        pod_block = re.sub(r'article\.color', 'pod.color', pod_block)
        pod_block = re.sub(r'med\.color', 'pod.color', pod_block)
        pod_block = re.sub(r'meditation\?\.color', 'pod.color', pod_block)
        block = block[:pod_list_start] + pod_block + block[pod_list_end:]
        
    content = content[:main_start] + block


with open('app/(tabs)/explore.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed explore.tsx variable scopes')
