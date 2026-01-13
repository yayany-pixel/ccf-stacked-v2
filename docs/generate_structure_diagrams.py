"""
Generate CCF Website Structure PDF from Mermaid diagrams
Requires: npm install -g @mermaid-js/mermaid-cli
          pip install Pillow reportlab
"""

import subprocess
import os
from pathlib import Path

# Mermaid diagram for Page 1: Site Structure Map
SITEMAP_MERMAID = """
graph TB
    HOME[Homepage<br/>colorcocktailfactory.com<br/>Location chooser + Brand intro]
    
    HOME --> CHICAGO[Chicago Hub<br/>/chicago<br/>SEO landing]
    HOME --> EUGENE[Eugene Hub<br/>/eugene<br/>SEO landing]
    HOME --> BLOG[Blog<br/>/blog<br/>Content SEO]
    HOME --> ACTIVITIES[All Classes<br/>/activities<br/>Catalog]
    HOME --> TEACH[Teach<br/>/teach<br/>Recruitment]
    HOME --> PRIVATE[Private Events<br/>/private-events<br/>Group bookings]
    HOME --> GIFTS[Gift Cards<br/>/gift-cards<br/>E-commerce]
    
    CHICAGO --> CHI_DATE[Date Night<br/>High-converter]
    CHICAGO --> CHI_BEGIN[Beginner Wheel<br/>Entry point]
    CHICAGO --> CHI_HAND[Handbuilding<br/>Alternative]
    CHICAGO --> CHI_LAMP[Turkish Lamp<br/>Premium]
    CHICAGO --> CHI_GLASS[Glass Fusion<br/>Specialty]
    CHICAGO --> CHI_MOSAIC[Mosaics<br/>Craft]
    CHICAGO --> CHI_BONSAI[Bonsai<br/>Nature]
    
    EUGENE --> EUG_DATE[Date Night<br/>High-converter]
    EUGENE --> EUG_BEGIN[Beginner Wheel<br/>Entry point]
    EUGENE --> EUG_TERRA[Terrarium<br/>Nature]
    EUGENE --> EUG_CANDLE[Candle Making<br/>Craft]
    EUGENE --> EUG_GLASS[Glass Fusion<br/>Specialty]
    
    PRIVATE --> TEAM[Team Building<br/>Corporate]
    PRIVATE --> BIRTHDAY[Birthday Parties<br/>Celebrations]
    PRIVATE --> BACH[Bachelorette<br/>Groups]
    PRIVATE --> CORP[Corporate<br/>Business]
    
    BLOG --> BLOG_POST[Posts<br/>/blog/slug<br/>SEO content]
    
    TEACH --> TEACH_APPLY[Apply<br/>Form]
    TEACH --> TEACH_FAQ[FAQ<br/>Info]
    TEACH --> TEACH_PAY[Pay<br/>Compensation]
    TEACH --> TEACH_LOGIN[Dashboard<br/>Portal]
    
    ACTIVITIES --> ACT_CAT[Detail Pages<br/>/activities/slug]
    
    CHI_DATE -.->|RezClick| REZCLICK[Calendar Booking<br/>CONVERSION]
    EUG_DATE -.->|RezClick| REZCLICK
    
    PRIVATE -.->|Submit| THANKS_PARTY[Thank You<br/>Confirmation]
    TEACH_APPLY -.->|Submit| THANKS_INST[Thank You<br/>Confirmation]
    
    style HOME fill:#9333ea,stroke:#7c3aed,color:#fff
    style CHICAGO fill:#ec4899,stroke:#db2777,color:#fff
    style EUGENE fill:#10b981,stroke:#059669,color:#fff
    style REZCLICK fill:#f59e0b,stroke:#d97706,color:#fff,stroke-width:3px
    style PRIVATE fill:#8b5cf6,stroke:#7c3aed,color:#fff
"""

# Mermaid diagram for Page 2: Homepage Wireframe
HOMEPAGE_MERMAID = """
graph TB
    subgraph HERO[" HERO SECTION - Above the Fold "]
        TAGLINE["Tagline: Creativity is shareable"]
        H1["H1: Choose Your Location"]
        DESC["Expert-guided pottery, glass fusion,<br/>mosaics in Chicago & Eugene"]
        VIDEO["VIDEO SWITCHER<br/>Default: Studio Short 9:16<br/>Option: Full Video 16:9<br/>Next button overlay"]
    end
    
    subgraph LOCATIONS[" LOCATION CARDS "]
        CHI_CARD["Chicago Card<br/>Pilsen Neighborhood<br/>Top 6 classes<br/>Hours + CTA"]
        EUG_CARD["Eugene Card<br/>Oregon<br/>Top 6 classes<br/>Hours + CTA"]
    end
    
    subgraph GROUPS[" GROUP EVENTS SECTION "]
        GROUP_INTRO["Perfect for Groups & Celebrations"]
        CARDS["Team Building | Birthday | Bachelorette"]
        QUOTE_CTA["Request Private Event Quote"]
    end
    
    subgraph WHY[" WHY CCF SECTION "]
        WHY_H2["Why Color Cocktail Factory?"]
        WHY_STORY["150,000+ guests since 2009<br/>Beginner-friendly | BYOB | Experts"]
        TRUST_BADGES["Expert Instructors<br/>BYOB Welcome<br/>Take Home Art"]
    end
    
    subgraph FINAL[" FINAL CTA "]
        READY["Ready to Create Something Amazing?"]
        DUAL_CTA["Explore Chicago | Explore Eugene"]
        FOOTER_LINKS["Blog • Events • Activities"]
    end
    
    subgraph FOOTER[" FOOTER "]
        FOOT_NAV["Navigation: About | Classes | Private Events<br/>Gift Cards | Teach | Blog | Contact"]
        SOCIAL["Social Media Links"]
        LEGAL["Privacy | Terms | Accessibility"]
    end
    
    HERO --> VIDEO
    VIDEO --> LOCATIONS
    LOCATIONS --> CHI_CARD
    LOCATIONS --> EUG_CARD
    CHI_CARD --> GROUPS
    EUG_CARD --> GROUPS
    GROUPS --> GROUP_INTRO
    GROUP_INTRO --> CARDS
    CARDS --> QUOTE_CTA
    QUOTE_CTA --> WHY
    WHY --> WHY_STORY
    WHY_STORY --> TRUST_BADGES
    TRUST_BADGES --> FINAL
    FINAL --> DUAL_CTA
    DUAL_CTA --> FOOTER
    FOOTER --> FOOT_NAV
    FOOT_NAV --> SOCIAL
    SOCIAL --> LEGAL
    
    style HERO fill:#9333ea,stroke:#7c3aed,color:#fff
    style VIDEO fill:#f59e0b,stroke:#d97706,color:#fff,stroke-width:3px
    style LOCATIONS fill:#ec4899,stroke:#db2777,color:#fff
    style GROUPS fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style WHY fill:#06b6d4,stroke:#0891b2,color:#fff
    style FINAL fill:#10b981,stroke:#059669,color:#fff
    style FOOTER fill:#64748b,stroke:#475569,color:#fff
"""

def generate_diagrams():
    """Generate PNG images from Mermaid diagrams using mmdc CLI"""
    
    # Write Mermaid files
    Path("sitemap.mmd").write_text(SITEMAP_MERMAID)
    Path("homepage.mmd").write_text(HOMEPAGE_MERMAID)
    
    print("📝 Mermaid files created")
    print("🎨 Generating diagrams...")
    print("\nNote: This requires @mermaid-js/mermaid-cli to be installed")
    print("Install with: npm install -g @mermaid-js/mermaid-cli\n")
    
    # Generate PNGs using mmdc (Mermaid CLI)
    try:
        subprocess.run([
            "mmdc", 
            "-i", "sitemap.mmd", 
            "-o", "page1-sitemap.png",
            "-w", "1200",
            "-H", "1600",
            "-b", "white"
        ], check=True)
        
        subprocess.run([
            "mmdc", 
            "-i", "homepage.mmd", 
            "-o", "page2-homepage.png",
            "-w", "1200",
            "-H", "1600",
            "-b", "white"
        ], check=True)
        
        print("✅ PNG diagrams generated successfully!")
        return True
        
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        print(f"❌ Error: {e}")
        print("\n💡 Alternative: Use online Mermaid editor:")
        print("   https://mermaid.live/")
        print("   Copy the diagrams from sitemap.mmd and homepage.mmd")
        return False

def create_pdf():
    """Create PDF from PNG images using reportlab"""
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas
        from reportlab.lib.utils import ImageReader
        from PIL import Image
        
        c = canvas.Canvas("CCF-Website-Structure.pdf", pagesize=letter)
        width, height = letter
        
        # Page 1: Site Structure Map
        if Path("page1-sitemap.png").exists():
            img1 = ImageReader("page1-sitemap.png")
            img_width, img_height = Image.open("page1-sitemap.png").size
            aspect = img_height / img_width
            display_width = width - 100
            display_height = display_width * aspect
            
            if display_height > height - 100:
                display_height = height - 100
                display_width = display_height / aspect
            
            x = (width - display_width) / 2
            y = (height - display_height) / 2
            
            c.setFont("Helvetica-Bold", 16)
            c.drawCentredString(width/2, height - 30, "Color Cocktail Factory - Site Structure Map")
            c.drawImage(img1, x, y, width=display_width, height=display_height)
            c.showPage()
        
        # Page 2: Homepage Wireframe
        if Path("page2-homepage.png").exists():
            img2 = ImageReader("page2-homepage.png")
            img_width, img_height = Image.open("page2-homepage.png").size
            aspect = img_height / img_width
            display_width = width - 100
            display_height = display_width * aspect
            
            if display_height > height - 100:
                display_height = height - 100
                display_width = display_height / aspect
            
            x = (width - display_width) / 2
            y = (height - display_height) / 2
            
            c.setFont("Helvetica-Bold", 16)
            c.drawCentredString(width/2, height - 30, "Homepage Structure - Above Fold to Footer")
            c.drawImage(img2, x, y, width=display_width, height=display_height)
        
        c.save()
        print("✅ PDF created: CCF-Website-Structure.pdf")
        
    except ImportError:
        print("❌ reportlab or Pillow not installed")
        print("Install with: pip install reportlab Pillow")

if __name__ == "__main__":
    print("🎨 CCF Website Structure Generator\n")
    
    if generate_diagrams():
        create_pdf()
        print("\n✨ Complete! Files generated:")
        print("   • page1-sitemap.png")
        print("   • page2-homepage.png")
        print("   • CCF-Website-Structure.pdf")
    else:
        print("\n📋 Manual steps:")
        print("   1. Visit https://mermaid.live/")
        print("   2. Copy content from sitemap.mmd")
        print("   3. Export as PNG (1200x1600)")
        print("   4. Repeat for homepage.mmd")
        print("   5. Combine into PDF using any PDF tool")
