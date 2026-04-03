/**
 * Mock Data Layer — TechRadar Prototype
 *
 * This file contains all the mock data for the 13 tracked technologies.
 * In a production version, this would be replaced by API calls to OpenAlex,
 * GitHub, CORDIS, Wikipedia, etc. The rest of the app imports from here,
 * so swapping in real data only requires changing this file.
 *
 * Structure:
 *  - Each technology has metadata (name, domain, phase, descriptions)
 *  - Each has 24 months of time-series data for 4 signal bands
 *  - Composite metrics (strength, velocity, breadth) are computed in utils/metrics.js
 */

// Helper: generate a time-series array of 24 monthly values.
// `baseFn` takes a month index (0–23) and returns a value.
function generateSeries(baseFn) {
  return Array.from({ length: 24 }, (_, i) => {
    const month = new Date(2024, 4 + i, 1); // May 2024 – Apr 2026
    return {
      date: month.toISOString().slice(0, 7), // "2024-05"
      value: Math.max(0, Math.round(baseFn(i))),
    };
  });
}

// Curve shapes used to create realistic trajectories
const curves = {
  // Accelerating growth (e.g., agentic AI hype)
  exponential: (base, rate) => (i) => base + base * (Math.pow(1 + rate, i) - 1) + (Math.random() - 0.5) * base * 0.1,
  // Linear growth
  linear: (base, slope) => (i) => base + slope * i + (Math.random() - 0.5) * base * 0.08,
  // S-curve (logistic) — starts slow, accelerates, then plateaus
  sCurve: (floor, ceiling, midpoint, steepness) => (i) =>
    floor + (ceiling - floor) / (1 + Math.exp(-steepness * (i - midpoint))) + (Math.random() - 0.5) * (ceiling - floor) * 0.05,
  // Plateau — grew early, now flat
  plateau: (level, noise) => (i) => level + (Math.random() - 0.5) * noise,
  // Slow emergence — low and slowly rising
  emerging: (base, rate) => (i) => base + rate * Math.sqrt(i) + (Math.random() - 0.5) * base * 0.15,
};

const technologies = [
  // ─── AI ───────────────────────────────────────────────
  {
    id: "agentic-ai",
    name: "Agentic AI",
    domain: "AI",
    subdomain: "Agentic AI",
    phase: 2,
    description:
      "AI systems that can autonomously plan, execute multi-step tasks, use tools, and collaborate with other agents. Moving rapidly from research demos to production deployment.",
    governanceNarrative: `Agentic AI represents a qualitative shift in AI capability: from systems that respond to prompts to systems that autonomously pursue goals over extended periods. This raises novel governance challenges around accountability, since actions taken by AI agents may have real-world consequences that are difficult to attribute to any single human decision-maker.

The transnational dimension is significant. Agentic AI systems can operate across jurisdictions simultaneously — executing financial transactions, gathering intelligence, or coordinating supply chains across borders without human oversight at each step. Existing regulatory frameworks assume a human in the loop for consequential decisions.

Intergovernmental attention is warranted on: (1) liability frameworks for autonomous agent actions, (2) standards for agent identification and traceability, and (3) protocols for cross-border agent operations, particularly in critical infrastructure and financial systems.`,
    crossBorder:
      "Agentic AI systems can operate across jurisdictional boundaries autonomously, executing tasks in multiple countries simultaneously. This creates challenges for liability attribution, regulatory oversight, and enforcement of national AI governance frameworks.",
    signals: {
      academic: generateSeries(curves.exponential(30, 0.08)),
      builder: generateSeries(curves.exponential(40, 0.12)),
      capital: generateSeries(curves.exponential(50, 0.09)),
      discourse: generateSeries(curves.exponential(25, 0.11)),
    },
  },
  {
    id: "foundation-models",
    name: "Foundation Models",
    domain: "AI",
    subdomain: "Foundation Models",
    phase: 3,
    description:
      "Large-scale pre-trained models (LLMs, multimodal models) that serve as general-purpose AI infrastructure. Now in mainstream commercial deployment with decelerating growth.",
    governanceNarrative: `Foundation models have crossed into mainstream deployment faster than almost any previous technology class. Major commercial products now embed these models, and hundreds of millions of people interact with them daily. The governance challenge has shifted from "should we regulate?" to "how do we regulate effectively?"

Key intergovernmental concerns include: compute concentration (training frontier models requires resources available to only a handful of entities globally), the environmental footprint of large-scale training runs, and the difficulty of auditing models whose behavior emerges from training data rather than explicit programming.

International coordination is needed on: (1) safety evaluation standards and mutual recognition of AI safety assessments, (2) compute governance and reporting thresholds, and (3) frameworks for open-weight model release that balance innovation with misuse prevention.`,
    crossBorder:
      "Foundation models are developed in a small number of countries but deployed globally. Training data is sourced internationally, and model capabilities affect all nations regardless of where development occurs. Supply chain concentration in AI chips adds a geopolitical dimension.",
    signals: {
      academic: generateSeries(curves.plateau(85, 12)),
      builder: generateSeries(curves.plateau(95, 8)),
      capital: generateSeries(curves.sCurve(70, 90, 8, 0.4)),
      discourse: generateSeries(curves.plateau(90, 10)),
    },
  },
  {
    id: "synthetic-media",
    name: "Synthetic Media / Deepfakes",
    domain: "AI",
    subdomain: "Synthetic Media / Deepfakes",
    phase: 3,
    description:
      "AI-generated images, video, audio, and text that are increasingly indistinguishable from authentic content. High public discourse signal reflects societal concern.",
    governanceNarrative: `Synthetic media has moved from a niche technical capability to a mainstream societal challenge. The ability to generate convincing fake video, audio, and images of real people is now accessible to anyone with a smartphone. This technology directly threatens the information ecosystem that democratic governance depends on.

The governance urgency is high because synthetic media exploits a fundamental assumption of human communication — that seeing and hearing are believing. Election integrity, judicial evidence standards, journalism, and diplomatic communications all depend on the ability to distinguish authentic from fabricated content.

Intergovernmental action is needed on: (1) international standards for content provenance and authentication (building on C2PA and similar initiatives), (2) cross-border enforcement cooperation for harmful deepfakes, and (3) harmonized legal frameworks that balance expression rights with protection from non-consensual synthetic media.`,
    crossBorder:
      "Synthetic media created in one jurisdiction spreads globally within minutes via social platforms. Deepfakes targeting political figures can destabilize international relations. No single country can address this through domestic regulation alone.",
    signals: {
      academic: generateSeries(curves.linear(50, 1.2)),
      builder: generateSeries(curves.sCurve(40, 75, 10, 0.35)),
      capital: generateSeries(curves.linear(35, 1.5)),
      discourse: generateSeries(curves.plateau(92, 8)),
    },
  },
  {
    id: "ai-scientific-discovery",
    name: "AI for Scientific Discovery",
    domain: "AI",
    subdomain: "AI for Scientific Discovery",
    phase: 1.5,
    description:
      "AI systems that accelerate scientific research — protein folding, materials science, drug discovery, climate modeling. Strong academic signal with growing builder adoption.",
    governanceNarrative: `AI-driven scientific discovery is accelerating research timelines from years to weeks in some domains. AlphaFold's impact on structural biology is the most visible example, but similar transformations are underway in materials science, drug discovery, and climate modeling. This acceleration raises questions about equitable access to AI research tools.

A key governance concern is the dual-use nature of AI-accelerated science. The same tools that discover new medicines can potentially design novel pathogens. The same systems that model climate solutions can optimize resource extraction. Speed of discovery may outpace the ability of safety review processes to keep up.

International coordination is needed on: (1) equitable access to AI research infrastructure for developing nations, (2) updated biosafety and dual-use research frameworks for AI-accelerated science, and (3) data sharing agreements that enable collaborative AI-driven research while respecting national interests.`,
    crossBorder:
      "Scientific discovery is inherently transnational. AI tools that accelerate it create asymmetries between countries with and without access. Dual-use risks (especially in biology and chemistry) require international safety frameworks.",
    signals: {
      academic: generateSeries(curves.exponential(60, 0.06)),
      builder: generateSeries(curves.sCurve(15, 55, 14, 0.3)),
      capital: generateSeries(curves.linear(30, 2)),
      discourse: generateSeries(curves.emerging(15, 5)),
    },
  },

  // ─── QUANTUM ──────────────────────────────────────────
  {
    id: "quantum-computing",
    name: "Quantum Computing",
    domain: "Quantum",
    subdomain: "Quantum Computing",
    phase: 1.5,
    description:
      "Computers that exploit quantum mechanical phenomena to solve problems intractable for classical machines. Still primarily in research but attracting significant capital investment.",
    governanceNarrative: `Quantum computing poses a long-horizon but potentially transformative governance challenge. While current quantum computers cannot yet outperform classical machines on practical problems, the trajectory suggests this threshold may be crossed within the next decade for specific applications — most critically, breaking widely-used encryption standards.

The "harvest now, decrypt later" threat is already present: adversaries may be collecting encrypted communications today to decrypt once quantum computers are capable. This creates an urgent need for post-quantum cryptographic migration, even though the quantum threat itself is not yet realized.

Intergovernmental attention is warranted on: (1) coordinated timelines for post-quantum cryptographic migration across international institutions, (2) export controls and technology sharing agreements for quantum hardware, and (3) frameworks for quantum computing access that prevent dangerous concentration of capability.`,
    crossBorder:
      "Quantum computing is a strategic technology with direct national security implications. The ability to break encryption has transnational consequences. International coordination on post-quantum standards is essential for continued secure communication.",
    signals: {
      academic: generateSeries(curves.linear(70, 1.8)),
      builder: generateSeries(curves.emerging(20, 4)),
      capital: generateSeries(curves.exponential(45, 0.07)),
      discourse: generateSeries(curves.linear(30, 1.5)),
    },
  },
  {
    id: "post-quantum-crypto",
    name: "Post-Quantum Cryptography",
    domain: "Quantum",
    subdomain: "Post-Quantum Cryptography",
    phase: 2,
    description:
      "Cryptographic algorithms designed to resist attacks by quantum computers. NIST standardization is driving rapid builder adoption.",
    governanceNarrative: `Post-quantum cryptography (PQC) is a rare example of proactive technology governance — the cryptographic community is preparing for a threat (quantum decryption) before it materializes. NIST's standardization of PQC algorithms in 2024 marked a critical milestone, but the migration challenge is enormous.

Every system that uses public-key cryptography — banking, healthcare, government communications, critical infrastructure — must eventually migrate to post-quantum algorithms. This is arguably the largest coordinated technology migration in history, comparable to Y2K but more technically complex.

International coordination is essential on: (1) harmonized migration timelines and standards (building on but extending beyond NIST), (2) support for developing nations in migrating critical infrastructure, and (3) interoperability standards to ensure post-quantum systems work across borders.`,
    crossBorder:
      "Cryptographic standards are inherently international — secure communication requires all parties to use compatible algorithms. Uneven PQC migration creates vulnerabilities that affect interconnected global systems.",
    signals: {
      academic: generateSeries(curves.sCurve(40, 65, 10, 0.4)),
      builder: generateSeries(curves.exponential(25, 0.09)),
      capital: generateSeries(curves.linear(20, 2.5)),
      discourse: generateSeries(curves.emerging(10, 4)),
    },
  },

  // ─── BIOTECH ──────────────────────────────────────────
  {
    id: "gene-editing",
    name: "Gene Editing (CRISPR)",
    domain: "Biotech",
    subdomain: "Gene Editing (CRISPR)",
    phase: 2.5,
    description:
      "Precise modification of DNA sequences using CRISPR-Cas9 and related tools. Transitioning from research to approved therapies, with broad societal implications.",
    governanceNarrative: `CRISPR gene editing has moved from laboratory breakthrough to approved medical therapy in under a decade — an extraordinarily rapid translation. The first CRISPR-based therapy (Casgevy for sickle cell disease) was approved in 2023, and dozens more are in clinical trials. But therapeutic applications are only part of the picture.

The governance frontier has shifted to heritable modifications (germline editing), gene drives for ecosystem management, and agricultural applications. The 2018 He Jiankui case — in which a researcher created gene-edited babies in defiance of international norms — demonstrated that governance gaps can be exploited with real consequences.

Intergovernmental priorities include: (1) enforceable international standards on human germline editing, (2) governance frameworks for gene drives that could alter shared ecosystems, and (3) equitable access provisions to prevent gene editing from becoming a technology that widens global health inequalities.`,
    crossBorder:
      "Gene editing of heritable traits affects future generations globally. Gene drives can spread across borders through ecosystems. Regulatory arbitrage (conducting research in less-regulated jurisdictions) is a demonstrated risk.",
    signals: {
      academic: generateSeries(curves.plateau(75, 10)),
      builder: generateSeries(curves.sCurve(30, 60, 8, 0.35)),
      capital: generateSeries(curves.sCurve(40, 70, 10, 0.3)),
      discourse: generateSeries(curves.sCurve(50, 75, 6, 0.4)),
    },
  },
  {
    id: "synthetic-biology",
    name: "Synthetic Biology",
    domain: "Biotech",
    subdomain: "Synthetic Biology",
    phase: 1.5,
    description:
      "Engineering biological systems from scratch — designing organisms, metabolic pathways, and biological circuits for industrial, medical, and environmental applications.",
    governanceNarrative: `Synthetic biology extends beyond editing existing genes to designing entirely new biological systems. This capability is becoming more accessible as DNA synthesis costs fall and AI tools accelerate biological design. The combination of AI and synthetic biology is particularly significant — AI can now design protein structures and metabolic pathways that would take human researchers years to develop.

The dual-use concern is acute. The same tools that design beneficial organisms can potentially create dangerous ones. As the technology democratizes, the barrier to creating harmful biological agents decreases. The COVID-19 pandemic demonstrated how biological threats can cascade globally.

International governance needs include: (1) strengthened Biological Weapons Convention provisions that account for synthetic biology capabilities, (2) screening standards for DNA synthesis providers (building on industry self-governance but making it mandatory and universal), and (3) biosafety frameworks for environmental release of synthetic organisms.`,
    crossBorder:
      "Synthetic organisms do not respect borders. Environmental release in one country can have global ecological consequences. The biosecurity implications of democratized biology are inherently transnational.",
    signals: {
      academic: generateSeries(curves.linear(45, 2)),
      builder: generateSeries(curves.emerging(15, 4.5)),
      capital: generateSeries(curves.exponential(25, 0.06)),
      discourse: generateSeries(curves.emerging(12, 3)),
    },
  },

  // ─── NEUROTECH ────────────────────────────────────────
  {
    id: "brain-computer-interfaces",
    name: "Brain-Computer Interfaces",
    domain: "Neurotech",
    subdomain: "Brain-Computer Interfaces",
    phase: 1.5,
    description:
      "Direct communication pathways between the brain and external devices. Moving from medical research into early commercial applications.",
    governanceNarrative: `Brain-computer interfaces (BCIs) represent a frontier where technology meets the most intimate aspects of human identity — thought, intention, and consciousness. While current applications are primarily medical (helping paralyzed patients communicate or control prosthetics), commercial BCIs are emerging for consumer applications.

The governance challenge is profound: BCIs raise questions about mental privacy, cognitive liberty, and what it means to be human in an age of neural augmentation. Neural data is arguably the most sensitive category of personal data — it can reveal thoughts, emotions, health conditions, and cognitive states.

Intergovernmental attention is warranted on: (1) neural rights frameworks that protect mental privacy and cognitive liberty, (2) standards for neural data protection that go beyond existing data protection laws, and (3) ethical guidelines for non-medical cognitive enhancement that address equity and access concerns.`,
    crossBorder:
      "Neural data collected by BCI devices may be processed across borders. Standards for neural rights and cognitive liberty require international consensus. Military applications of BCIs have arms control implications.",
    signals: {
      academic: generateSeries(curves.linear(40, 1.5)),
      builder: generateSeries(curves.emerging(10, 3.5)),
      capital: generateSeries(curves.exponential(20, 0.08)),
      discourse: generateSeries(curves.sCurve(15, 45, 16, 0.35)),
    },
  },

  // ─── SPACE ────────────────────────────────────────────
  {
    id: "satellite-mega-constellations",
    name: "Satellite Mega-Constellations",
    domain: "Space",
    subdomain: "Satellite Mega-Constellations",
    phase: 2.5,
    description:
      "Networks of hundreds to thousands of satellites in low Earth orbit providing global broadband, Earth observation, and communications services.",
    governanceNarrative: `Satellite mega-constellations are transforming the space environment and global communications infrastructure simultaneously. SpaceX's Starlink alone has launched over 6,000 satellites, with plans for tens of thousands more. Other constellations (OneWeb, Amazon's Kuiper, various national programs) add to a rapidly crowding orbital environment.

The governance challenge is multi-dimensional: orbital debris and collision risk, radio frequency interference, light pollution affecting astronomy, and the geopolitical implications of a single country's companies controlling much of the world's satellite internet infrastructure.

International coordination is critical on: (1) binding space sustainability standards and debris mitigation requirements, (2) equitable allocation of orbital slots and radio spectrum, and (3) governance frameworks for satellite-based internet services that balance connectivity benefits with national sovereignty concerns.`,
    crossBorder:
      "Satellites operate in a shared global commons (outer space). Orbital debris from one operator threatens all space users. Satellite internet services cross all borders, creating jurisdictional challenges for content regulation and data sovereignty.",
    signals: {
      academic: generateSeries(curves.linear(35, 1.2)),
      builder: generateSeries(curves.sCurve(30, 65, 8, 0.3)),
      capital: generateSeries(curves.plateau(70, 12)),
      discourse: generateSeries(curves.sCurve(40, 65, 6, 0.35)),
    },
  },

  // ─── CLIMATE TECH ─────────────────────────────────────
  {
    id: "carbon-capture",
    name: "Carbon Capture",
    domain: "Climate Tech",
    subdomain: "Carbon Capture",
    phase: 2,
    description:
      "Technologies that capture CO2 from industrial sources or directly from the atmosphere. Attracting significant capital investment and government R&D funding.",
    governanceNarrative: `Carbon capture technologies — both point-source capture from industrial facilities and direct air capture (DAC) — are receiving unprecedented investment as countries seek pathways to net-zero emissions. The technology is real but faces questions of cost, scale, and whether it might reduce urgency for emissions reduction.

The governance challenge centers on: verification and accounting (how do we reliably measure and verify captured carbon?), moral hazard (does the promise of carbon capture delay necessary emissions cuts?), and equitable deployment (will carbon capture benefit the same industrialized nations that caused the climate crisis?).

Intergovernmental priorities include: (1) internationally recognized standards for carbon capture measurement, reporting, and verification (MRV), (2) integration of carbon capture into Article 6 carbon market mechanisms under the Paris Agreement, and (3) technology transfer frameworks to ensure developing nations can access and deploy these technologies.`,
    crossBorder:
      "Climate change is the defining transnational challenge. Carbon capture deployed anywhere benefits the global atmosphere. But governance of carbon credits, verification standards, and technology access require international coordination.",
    signals: {
      academic: generateSeries(curves.linear(40, 2.2)),
      builder: generateSeries(curves.sCurve(20, 50, 12, 0.3)),
      capital: generateSeries(curves.exponential(50, 0.07)),
      discourse: generateSeries(curves.linear(35, 1.8)),
    },
  },

  // ─── DIGITAL INFRASTRUCTURE ───────────────────────────
  {
    id: "decentralized-identity",
    name: "Decentralized Identity",
    domain: "Digital Infrastructure",
    subdomain: "Decentralized Identity",
    phase: 1.5,
    description:
      "Self-sovereign identity systems using verifiable credentials and decentralized identifiers, enabling individuals to control their own digital identity without relying on centralized authorities.",
    governanceNarrative: `Decentralized identity (DID) systems promise to give individuals control over their digital identities — a fundamental shift from the current model where identity is managed by governments, corporations, or platforms. The EU's eIDAS 2.0 regulation and digital identity wallet initiative represent the most ambitious government-backed deployment of these concepts.

The governance opportunity is significant: decentralized identity could reduce identity fraud, enable privacy-preserving verification, and provide digital identity to the estimated 850 million people worldwide who lack official identification. But implementation choices carry risks — poorly designed systems could enable surveillance or exclude vulnerable populations.

International coordination is needed on: (1) interoperability standards so digital identity credentials work across borders, (2) mutual recognition frameworks for verifiable credentials issued by different countries, and (3) human rights-centered design principles that ensure decentralized identity systems protect rather than erode privacy and inclusion.`,
    crossBorder:
      "Digital identity is inherently cross-border in a connected world. Travel, trade, migration, and remote work all require identity verification across jurisdictions. Interoperability of identity systems is a prerequisite for digital public infrastructure.",
    signals: {
      academic: generateSeries(curves.linear(25, 1.5)),
      builder: generateSeries(curves.sCurve(15, 40, 14, 0.3)),
      capital: generateSeries(curves.emerging(15, 3)),
      discourse: generateSeries(curves.emerging(8, 2.5)),
    },
  },

  // ─── ROBOTICS ─────────────────────────────────────────
  {
    id: "humanoid-robotics",
    name: "Humanoid Robotics",
    domain: "Robotics",
    subdomain: "Humanoid Robotics",
    phase: 2,
    description:
      "Bipedal robots designed for general-purpose tasks in human environments. Accelerating rapidly due to advances in AI, actuators, and manufacturing.",
    governanceNarrative: `Humanoid robotics is experiencing a sudden acceleration driven by the convergence of foundation models (giving robots general intelligence), improved actuator technology (making them physically capable), and massive capital investment from both tech companies and automakers. Multiple companies aim to deploy humanoid robots in warehouses and factories within 1–2 years.

The governance implications are primarily economic and social: widespread deployment of humanoid robots could displace millions of workers across manufacturing, logistics, healthcare, and service sectors. Unlike previous automation waves that affected specific tasks, humanoid robots are designed to be general-purpose — they can theoretically replace any human physical labor.

Intergovernmental attention is warranted on: (1) labor transition frameworks and social safety nets for robot-driven displacement, (2) safety standards for robots operating in close proximity to humans, and (3) ethical guidelines for humanoid robot deployment in caregiving, law enforcement, and military applications.`,
    crossBorder:
      "Humanoid robot deployment will reshape global manufacturing and labor markets. Countries that adopt first gain economic advantages, while those that lose manufacturing jobs face social disruption. Military applications raise arms control questions.",
    signals: {
      academic: generateSeries(curves.linear(35, 2.5)),
      builder: generateSeries(curves.exponential(20, 0.1)),
      capital: generateSeries(curves.exponential(35, 0.11)),
      discourse: generateSeries(curves.exponential(20, 0.09)),
    },
  },
];

export default technologies;
