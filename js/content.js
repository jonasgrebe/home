/*
 * Edit this file to maintain the site's content.
 * Publication filters operate directly on each project's tags.
 */
window.SITE_CONTENT = {
  /*
   * Add the newest update first. Type is free text, so this also works for
   * awards, talks, releases, grants, visits, and other milestones.
   * Supported fields: { date, type, title, detail, location, url, external, featured }
   * Set featured: true to keep an update in the compact News view.
   */
  news: [
    {
      date: "2026",
      type: "Two papers",
      title: "Our papers on concept erasure and backdoors were accepted to ICML 2026.",
      detail: "GEM and Erased but Not Forgotten study concept erasure from complementary directions.",
      location: "Seoul, South Korea",
      url: "#work",
      external: false,
      featured: true
    },
    {
      date: "2026",
      type: "Conference acceptance",
      title: "Our paper on concept erasure in autoregressive image generation was accepted to ECCV 2026.",
      detail: "Obliviate selectively removes concepts while preserving broader model capabilities.",
      location: "Malmö, Sweden",
      url: "#publication-obliviate",
      external: false,
      featured: true
    },
    {
      date: "2026",
      type: "Reviewer distinction",
      title: "I received Technical Reviewer Gold at ICML 2026.",
      detail: "The distinction included complimentary conference registration.",
      location: "Seoul, South Korea",
      url: "https://icml.cc/",
      external: true
    },
    {
      date: "2025",
      type: "Workshop acceptance",
      title: "Our paper on backdoors compromising concept erasure was accepted to ICML 2025 Workshop.",
      detail: "An earlier workshop version of Erased but Not Forgotten.",
      location: "Vancouver, Canada",
      url: "#publication-erased-not-forgotten",
      external: false
    },
    {
      date: "2025",
      type: "Reviewer distinction",
      title: "I received an Outstanding Reviewer Distinction at ICCV 2025.",
      detail: "Recognition for reviewing contributions to the ICCV 2025 technical program.",
      location: "Honolulu, USA",
      url: "https://iccv.thecvf.com/",
      external: true
    },
    {
      date: "2025",
      type: "Conference acceptance",
      title: "Our paper on backdoor attacks against open-set face recognition was accepted to WACV 2025.",
      detail: "My involvement was limited to the initial project phase, where I developed the loss function used for its backdoor mechanism.",
      location: "Tucson, USA",
      url: "#publication-open-set-backdoor",
      external: false,
      featured: true
    },
    {
      date: "2023",
      type: "Master thesis · Conference acceptance",
      title: "Our paper on identity-conditioned synthetic face generation was accepted to ICCV 2023.",
      detail: "IDiff-Face grew out of my master's thesis and my idea to apply diffusion models natively to synthetic face-recognition data generation. It was the first work to do so.",
      location: "Paris, France",
      url: "#publication-idiff-face",
      external: false
    }
  ],

  publicationFilters: [
    { id: "all", label: "All work" },
    { id: "multimodal", label: "Multimodal" },
    { id: "diffusion", label: "Diffusion" },
    { id: "autoregressive", label: "Autoregressive" },
    { id: "unified", label: "Unified" },
    { id: "safety", label: "Safety" },
    { id: "backdoors", label: "Backdoors" },
    { id: "biometrics", label: "Biometrics" }
  ],

  /*
   * The lifecycle map uses percentage positions so it can be adjusted without
   * changing the drawing code. x/y are desktop positions, mx/my are mobile.
   */
  lifecycle: {
    stages: [
      { id: "before", label: "Data", kind: "state", x: 12, mx: 50, my: 11 },
      { id: "training", label: "Training", kind: "operation", x: 29, mx: 50, my: 29 },
      { id: "alignment", label: "Alignment / fine-tuning", kind: "state", x: 49, mx: 50, my: 48 },
      { id: "release", label: "Release", detail: "Open / closed", kind: "operation", x: 69, mx: 50, my: 68 },
      { id: "inference", label: "Inference", kind: "state", x: 87, mx: 50, my: 87 }
    ],
    projects: [
      {
        id: "open-set-backdoor",
        label: "Effective Backdoor Learning",
        note: "A training-time backdoor mechanism for open-set face recognition.",
        targets: ["before", "training"],
        x: 14,
        y: 15,
        mx: 76,
        my: 20
      },
      {
        id: "token-by-token",
        label: "ToBAC",
        note: "Backdoors introduced during model preparation and activated during use.",
        targets: ["training", "inference"],
        x: 34,
        y: 15,
        mx: 23,
        my: 34
      },
      {
        id: "obliviate",
        label: "Obliviate",
        note: "Concept erasure for autoregressive image generators during adaptation.",
        targets: ["alignment"],
        x: 50,
        y: 15,
        mx: 23,
        my: 51
      },
      {
        id: "poisoned-conversation",
        label: "Privacy-Leaking Watermarks",
        note: "A poisoned released model turns later image generation into a covert leakage channel.",
        targets: ["release", "inference"],
        x: 71,
        y: 15,
        mx: 24,
        my: 72
      },
      {
        id: "stealth-multimodal",
        label: "FIRE",
        note: "Protecting exercises against AI-assisted cheating at the point of use.",
        targets: ["inference"],
        x: 92,
        y: 22,
        mx: 28,
        my: 95
      },
      {
        id: "idiff-face",
        label: "IDiff-Face",
        note: "Synthetic identity generation for training face-recognition systems.",
        targets: ["before", "training"],
        x: 12,
        y: 82,
        mx: 24,
        my: 8
      },
      {
        id: "erased-not-forgotten",
        label: "Erased but Not Forgotten",
        note: "A backdoor planted before adaptation and evaluated after concept erasure.",
        targets: ["before", "alignment"],
        x: 31,
        y: 82,
        mx: 77,
        my: 39
      },
      {
        id: "geometric-erasure",
        label: "GEM",
        note: "Concept erasure for rectified-flow models during adaptation.",
        targets: ["alignment"],
        x: 53,
        y: 82,
        mx: 77,
        my: 55
      },
      {
        id: "stealth-safety",
        label: "VETO",
        note: "Protecting images as they enter frontier editing systems.",
        targets: ["inference"],
        x: 85,
        y: 80,
        mx: 76,
        my: 82
      }
    ]
  },

  publications: [
    {
      id: "stealth-multimodal",
      index: "01",
      year: "2026",
      venue: "Preprint · 2026",
      venueType: "preprint",
      title: "Fighting Fire with Fire: On the Feasibility of Protecting Exercises Against AI Cheating",
      authors: "<a class='person-link' href='https://scholar.google.com/citations?user=wqVWJNIAAAAJ&amp;hl=en' target='_blank' rel='noreferrer'>Tobias Braun*</a>, <strong>Jonas H. Grebe*</strong>, <a class='person-link' href='https://scholar.google.com/citations?hl=en&amp;user=XS4GbYkAAAAJ' target='_blank' rel='noreferrer'>Louis Rethfeld</a>, <a class='person-link' href='https://scholar.google.com/citations?hl=en&amp;user=3kDtybgAAAAJ' target='_blank' rel='noreferrer'>Marcus Rohrbach</a>",
      summary: "Task-preserving visual perturbations that steer AI solvers toward secret wrong answers, creating an assignment-level fingerprint of sustained blind copying.",
      abstractExcerpt: "Fighting Fire with Fire protects multimodal multiple-choice exercises by adding subtle visual perturbations that steer AI solvers toward designated incorrect answers. Across an assignment, repeated target matches form a statistical fingerprint calibrated against black-box assistants, shifting detection from post-hoc authorship claims to preventive exercise design.",
      art: "art-fire",
      artLabel: "EDUCATION / PROTECTION",
      tags: ["Multimodal", "Safety", "Defenses", "Adversarial examples", "AI cheating"],
      links: [
        { label: "Project Page", url: "https://jonasgrebe.github.io/research/projects/fighting-fire-with-fire/" }
      ]
    },
    {
      id: "stealth-safety",
      index: "02",
      year: "2026",
      venue: "Preprint · 2026",
      venueType: "preprint",
      title: "VETO: Towards Protecting Images From Frontier AI Editing",
      authors: "<strong>Jonas H. Grebe*</strong>, <a class='person-link' href='https://scholar.google.com/citations?user=huveR90AAAAJ&amp;hl=en' target='_blank' rel='noreferrer'>Hossein Shakibania*</a>, <a class='person-link' href='https://scholar.google.com/citations?user=wqVWJNIAAAAJ&amp;hl=en' target='_blank' rel='noreferrer'>Tobias Braun</a>, <a class='person-link' href='https://scholar.google.com/citations?hl=en&amp;user=3kDtybgAAAAJ' target='_blank' rel='noreferrer'>Marcus Rohrbach</a>, <a class='person-link' href='https://scholar.google.com/citations?hl=en&amp;user=GHpxNQIAAAAJ' target='_blank' rel='noreferrer'>Anna Rohrbach</a>",
      summary: "A subtle per-image cloak that diffuses reference attention in unified image editors, disrupting faithful edits while keeping the source visually close to its original.",
      abstractExcerpt: "VETO protects source images from frontier unified editors by optimizing a subtle cloak over the joint-attention paths between reference and canvas tokens. By diffusing access to the source during editing, it disrupts faithful recontextualization and is evaluated with VetoBench across closed-frame and open-frame edits.",
      art: "art-veto",
      artLabel: "ANTI-EDIT / PROTECTION",
      tags: ["Multimodal", "Unified", "Safety", "Privacy", "Defenses", "Image editing"],
      links: [
        { label: "Project Page", url: "https://jonasgrebe.github.io/research/projects/veto/" },
        { label: "arXiv", url: "https://arxiv.org/abs/2607.27292" },
        { label: "Code", url: "https://github.com/multimodal-ai-lab/VETO" },
        { label: "VetoBench", url: "https://huggingface.co/datasets/MAI-Lab/VetoBench" }
      ]
    },
    {
      id: "obliviate",
      index: "03",
      year: "2026",
      venue: "ECCV 2026 · Malmö",
      venueType: "conference",
      title: "Obliviate: Erasing Concepts from Autoregressive Image Generation Models",
      authors: "<a class='person-link' href='https://scholar.google.com/citations?user=huveR90AAAAJ&amp;hl=en' target='_blank' rel='noreferrer'>Hossein Shakibania*</a>, <strong>Jonas H. Grebe*</strong>, <a class='person-link' href='https://scholar.google.com/citations?user=wqVWJNIAAAAJ&amp;hl=en' target='_blank' rel='noreferrer'>Tobias Braun*</a>, Ege Aktemur, Saleh Aslani, Mehmet Görkem Yiğit, <a class='person-link' href='https://scholar.google.com/citations?hl=en&amp;user=3kDtybgAAAAJ' target='_blank' rel='noreferrer'>Marcus Rohrbach</a>",
      summary: "Selective concept removal for autoregressive image generators while preserving their broader capabilities.",
      abstractExcerpt: "Obliviate brings concept erasure to autoregressive image generation through guidance over visual token distributions and complete generation trajectories. It is evaluated on Liquid, Emu3-Gen, and Janus-Pro across explicit content, graphic violence, and branded imagery.",
      art: "art-obliviate",
      artLabel: "TOKEN / ERASURE",
      motifs: [{ type: "malmo", glyph: "MALMÖ" }],
      tags: ["Autoregressive", "Unified", "Defenses", "Safety", "Multimodal"],
      links: [
        { label: "Project Page", url: "https://jonasgrebe.github.io/research/projects/obliviate/" },
        { label: "arXiv", url: "https://arxiv.org/abs/2606.28643" },
        { label: "Code", url: "https://github.com/multimodal-ai-lab/Obliviate" }
      ]
    },
    {
      id: "poisoned-conversation",
      index: "04",
      year: "2026",
      venue: "Work in progress",
      venueType: "preprint",
      title: "The Poisoned Conversation: Privacy-Leaking Watermarks in Unified Multimodal Models",
      authors: "Authors to be announced",
      summary: "Invisible, history-dependent watermarks that turn later image generation into a covert channel for privacy leakage.",
      abstractExcerpt: "This work introduces Privacy-Leaking Watermarks, invisible history-dependent signals that let a poisoned unified multimodal model encode sensitive chat attributes into later generated images. The attack turns apparently unrelated generations into a covert leakage channel while preserving the model's apparent utility.",
      art: "art-watermark",
      artLabel: "PRIVACY / WATERMARK",
      tags: ["Unified", "Multimodal", "Diffusion", "Privacy", "Watermarks", "Backdoors", "Attacks", "Safety"],
      links: []
    },
    {
      id: "geometric-erasure",
      index: "05",
      year: "2026",
      venue: "ICML 2026 · Seoul",
      venueType: "conference",
      distinction: "Spotlight",
      title: "GEM: Geometric Erasure by Contrastive Velocity Matching in Rectified Flows",
      authors: "<strong>Jonas H. Grebe*</strong>, <a class='person-link' href='https://scholar.google.com/citations?user=wqVWJNIAAAAJ&amp;hl=en' target='_blank' rel='noreferrer'>Tobias Braun*</a>, <a class='person-link' href='https://scholar.google.com/citations?hl=en&amp;user=GHpxNQIAAAAJ' target='_blank' rel='noreferrer'>Anna Rohrbach</a>, <a class='person-link' href='https://scholar.google.com/citations?hl=en&amp;user=3kDtybgAAAAJ' target='_blank' rel='noreferrer'>Marcus Rohrbach</a>",
      summary: "A geometric approach to concept erasure in rectified-flow models through contrastive velocity matching.",
      abstractExcerpt: "GEM introduces a concept-erasure framework for rectified-flow models. It combines complementary attraction and repulsion signals from a teacher into one geometric objective that suppresses targeted concepts while preserving benign generation.",
      art: "art-flow",
      artLabel: "FLOW / ERASURE",
      motifs: [{ type: "seoul", glyph: "서울" }],
      tags: ["Diffusion", "Defenses", "Safety", "Multimodal"],
      links: [
        { label: "Project Page", url: "https://jonasgrebe.github.io/research/projects/gem/" },
        { label: "arXiv", url: "https://arxiv.org/abs/2606.00140" },
        { label: "Code", url: "https://github.com/multimodal-ai-lab/GEM" }
      ]
    },
    {
      id: "token-by-token",
      index: "06",
      year: "2026",
      venue: "arXiv · 2026",
      venueType: "preprint",
      title: "Token by Token, Compromised: Backdoor Vulnerabilities in Unified Autoregressive Models",
      authors: "<a class='person-link' href='https://scholar.google.com/citations?user=wqVWJNIAAAAJ&amp;hl=en' target='_blank' rel='noreferrer'>Tobias Braun*</a>, <strong>Jonas H. Grebe*</strong>, <a class='person-link' href='https://scholar.google.com/citations?user=huveR90AAAAJ&amp;hl=en' target='_blank' rel='noreferrer'>Hossein Shakibania</a>, <a class='person-link' href='https://scholar.google.com/citations?hl=en&amp;user=GHpxNQIAAAAJ' target='_blank' rel='noreferrer'>Anna Rohrbach</a>, <a class='person-link' href='https://scholar.google.com/citations?hl=en&amp;user=3kDtybgAAAAJ' target='_blank' rel='noreferrer'>Marcus Rohrbach</a>",
      summary: "An analysis of backdoor vulnerabilities in unified autoregressive models across modalities.",
      abstractExcerpt: "This work presents ToBAC, a backdoor attack for unified autoregressive models that generate text and image tokens in one pass. It shows how ordinary characters or words can trigger malicious effects across multiple output modalities.",
      art: "art-token",
      artLabel: "TOKEN / BACKDOOR",
      motifs: [{ type: "australia", glyph: "🦘" }],
      tags: ["Autoregressive", "Unified", "Backdoors", "Multimodal", "Attacks"],
      links: [
        { label: "Project Page", url: "https://jonasgrebe.github.io/research/projects/token-by-token/" },
        { label: "arXiv", url: "https://arxiv.org/abs/2605.19227" }
      ]
    },
    {
      id: "erased-not-forgotten",
      index: "07",
      year: "2026",
      venue: "ICML 2026 · Seoul",
      secondaryVenue: "ICML 2025 Workshop · Vancouver",
      venueType: "conference",
      title: "Erased but Not Forgotten: How Backdoors Compromise Concept Erasure",
      authors: "<a class='person-link' href='https://scholar.google.com/citations?user=wqVWJNIAAAAJ&amp;hl=en' target='_blank' rel='noreferrer'>Tobias Braun*</a>, <strong>Jonas H. Grebe*</strong>, <a class='person-link' href='https://scholar.google.com/citations?hl=en&amp;user=3kDtybgAAAAJ' target='_blank' rel='noreferrer'>Marcus Rohrbach</a>, <a class='person-link' href='https://scholar.google.com/citations?hl=en&amp;user=GHpxNQIAAAAJ' target='_blank' rel='noreferrer'>Anna Rohrbach</a>",
      summary: "A threat model showing how hidden backdoors can undermine concept-erasure methods.",
      abstractExcerpt: "The Erasure Evasion Backdoor binds a trigger to a concept before erasure and tests whether that hidden link survives. Across six erasure methods, the attack exposes harmful content that standard post-erasure checks can miss.",
      art: "art-erased",
      artLabel: "ERASURE / BACKDOOR",
      motifs: [
        { type: "seoul", glyph: "서울" },
        { type: "vancouver", glyph: "🦫" }
      ],
      tags: ["Diffusion", "Backdoors", "Safety", "Robustness", "Multimodal"],
      links: [
        { label: "Project Page", url: "https://jonasgrebe.github.io/research/projects/erased-but-not-forgotten/" },
        { label: "arXiv", url: "https://arxiv.org/abs/2504.21072" },
        { label: "Code", url: "https://github.com/multimodal-ai-lab/EEB" }
      ]
    },
    {
      id: "open-set-backdoor",
      index: "08",
      year: "2025",
      venue: "WACV 2025 · Tucson",
      venueType: "conference",
      title: "Effective Backdoor Learning on Open-Set Face Recognition Systems",
      authors: "Diana Voth, Leonidas Dane, <strong>Jonas H. Grebe</strong>, Sebastian Peitz, <a class='person-link' href='https://scholar.google.com/citations?user=4iERqCYAAAAJ&amp;hl=en' target='_blank' rel='noreferrer'>Philipp Terhörst</a>",
      summary: "My involvement was limited to the initial project phase, where I developed the loss function used for its backdoor mechanism.",
      abstractExcerpt: "The paper shows that backdoor attacks designed for closed-set classifiers do not transfer well to open-set face recognition. It introduces Feature Stabilized Trigger Loss to support backdoor learning with physical and digital triggers in open-set systems.",
      art: "art-backdoor",
      artLabel: "BIOMETRICS / BACKDOOR",
      motifs: [{ type: "tucson", glyph: "☼" }],
      tags: ["Biometrics", "Face recognition", "Backdoors"],
      links: [
        { label: "Paper", url: "https://doi.org/10.1109/WACV61041.2025.00109" },
        { label: "Scholar", url: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=dvz7WRQAAAAJ&sortby=pubdate&citation_for_view=dvz7WRQAAAAJ:TQgYirikUcIC" }
      ]
    },
    {
      id: "idiff-face",
      index: "09",
      year: "2023",
      venue: "ICCV 2023 · Paris",
      venueType: "conference",
      title: "IDiff-Face: Synthetic-based Face Recognition through Fizzy Identity-Conditioned Diffusion Models",
      authors: "<a class='person-link' href='https://scholar.google.com/citations?user=C-zewBgAAAAJ&amp;hl=en' target='_blank' rel='noreferrer'>Fadi Boutros</a>, <strong>Jonas H. Grebe</strong>, <a class='person-link' href='https://scholar.google.com/citations?user=yy68pbIAAAAJ&amp;hl=en' target='_blank' rel='noreferrer'>Arjan Kuijper</a>, <a class='person-link' href='https://scholar.google.com/citations?user=bAyT17sAAAAJ&amp;hl=en' target='_blank' rel='noreferrer'>Naser Damer</a>",
      summary: "Originating from my master's thesis, IDiff-Face was the first work to apply diffusion models natively to synthetic face-recognition data generation, an idea I introduced.",
      abstractExcerpt: "IDiff-Face uses identity-conditioned latent diffusion to generate synthetic identities with realistic within-identity variation for face-recognition training. The approach narrows the performance gap between training on synthetic and authentic face data.",
      art: "art-idiff",
      artLabel: "SYNTHETIC / IDENTITY",
      motifs: [{ type: "paris", glyph: "🥐" }],
      tags: ["Diffusion", "Biometrics", "Face recognition", "Synthetic data", "Master thesis"],
      links: [
        { label: "Paper", url: "https://openaccess.thecvf.com/content/ICCV2023/html/Boutros_IDiff-Face_Synthetic-based_Face_Recognition_through_Fizzy_Identity-Conditioned_Diffusion_Model_ICCV_2023_paper.html" },
        { label: "arXiv", url: "https://arxiv.org/abs/2308.04995" },
        { label: "Code", url: "https://github.com/fdbtrs/IDiff-Face" }
      ]
    }
  ]
};
