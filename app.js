// ==========================================================================
// Predict It - Application State and Datasets
// ==========================================================================

// Default citizen reports seeded with initial verification counts
const defaultCitizenReports = [
    {
        id: 'cr-1',
        lat: 12.9254,
        lng: 77.6245,
        locality: "Silk Board Underpass, Bengaluru",
        hazardType: "flood",
        severity: "warning",
        desc: "Water logging started at underpass. Level is around 1.5 feet and rising. Commuters should avoid.",
        solution: "Divert traffic to flyover, run drainage pumps.",
        timestamp: "10 mins ago",
        user: "Citizen_Rahul",
        verifications: 5
    },
    {
        id: 'cr-2',
        lat: 30.5524,
        lng: 79.5624,
        locality: "Joshimath-Badrinath Hwy NH-58",
        hazardType: "landslide",
        severity: "critical",
        desc: "Minor rockfall and mud slippage observed on outer cliff lane. Rocks blocking partial traffic.",
        solution: "Deploy highway patrol to block lane and call clearance loaders.",
        timestamp: "24 mins ago",
        user: "Trucker_Somesh",
        verifications: 12
    },
    {
        id: 'cr-3',
        lat: 13.0422,
        lng: 80.2450,
        locality: "Marina Beach Promenade, Chennai",
        hazardType: "storm",
        severity: "advisory",
        desc: "Extremely high waves splashing 5 meters over the sea face barrier. Heavy wind gusts blowing trash.",
        solution: "Barricade promenade, stop tourists from walking close to waves.",
        timestamp: "45 mins ago",
        user: "Chennai_Watch",
        verifications: 2
    },
    {
        id: 'cr-4',
        lat: 26.2929,
        lng: 73.0185,
        locality: "Jodhpur Highway Pass, Rajasthan",
        hazardType: "storm",
        severity: "critical",
        desc: "Severe dust storm reducing visibility to less than 10 meters. High sand buildup on road.",
        solution: "Halt highway toll flow and guide vehicles to park near service bays.",
        timestamp: "1 hour ago",
        user: "Desert_Rider",
        verifications: 8
    }
];

const storedReports = localStorage.getItem('predictit_citizen_reports');
const initialReports = storedReports ? JSON.parse(storedReports) : defaultCitizenReports;

// Application State
const state = {
    selectedLocality: null,
    sensorIntervalId: null,
    sensorChart: null,
    reportingMode: false,
    map: null,
    localityLayers: {},
    citizenMarkers: [],
    citizenReports: initialReports,
    hazardLayerGroup: null,
    shelterLayerGroup: null,
    citizenLayerGroup: null
};

// Main Locality Hazards Database
const localitiesData = {
    "coastal-plain": {
        id: "coastal-plain",
        name: "Odisha Coastal Delta (Paradip Sector)",
        terrain: "Coastal Delta Lowland",
        severity: "critical",
        source: "Indian Meteorological Department (IMD)",
        threatTitle: "Category 4 Cyclone & Tidal Wave Inundation",
        threatEta: "10 Hours",
        threatDesc: "Severe cyclone warning active. Landfall predicted to trigger storm surges up to 3.8 meters, potentially inundating coastal neighborhoods up to 1.2km inland.",
        evacStrategy: "All residents within 1.5km of the coast must evacuate inland immediately. Follow NH-53 Westwards. DO NOT use the Coastal Link Road due to high wave splashing.",
        geoAdvantages: [
            "Bhitarkanika mangrove forest shield absorbs 40% of peak storm surge wave energy.",
            "High density of dedicated multi-storey concrete cyclone shelters along the East Coast."
        ],
        geoDisadvantages: [
            "Extremely low elevation (average 1.5m above sea level) triggers rapid tidal flooding.",
            "Only one arterial double-lane road leading inland, posing evacuation bottleneck risks."
        ],
        evacSteps: [
            "Secure heavy external fittings and board up glass windows with plywood.",
            "Unplug major electrical items and turn off gas cylinders before leaving.",
            "Move along NH-53 toward the elevated Paradip Central Safe Shelter."
        ],
        contacts: [
            { name: "Odisha Relief Commissioner", dept: "State Operations", phone: "+91-674-253-4177" },
            { name: "Paradip Port Emergency Cell", dept: "Relief Coordination", phone: "+91-6722-222005" },
            { name: "Cyclone Warning Hotline", dept: "IMD Broadcast", phone: "1800-180-1717" }
        ],
        shelter: {
            name: "Paradip Multi-Purpose Cyclone Shelter",
            address: "High Ridge Ridge Sector, Paradip Bypass Road",
            capacity: "1,800 Citizens",
            supplies: "Stocked - Emergency food, fresh water, and medical kits verified."
        },
        sensors: {
            param1Name: "Wind Velocity",
            param1Unit: "km/h",
            param1Base: 135,
            param1Trend: 3, // rising
            param2Name: "Tidal Tide Height",
            param2Unit: "meters",
            param2Base: 3.4,
            param2Trend: 0.1, // rising
            chartLabel: "Tide Height Gauge (m)"
        },
        coordinates: [20.280, 86.600],
        polygon: [
            [20.350, 86.500],
            [20.350, 86.750],
            [20.150, 86.750],
            [20.150, 86.500],
            [20.280, 86.450]
        ]
    },
    "hilly-pass": {
        id: "hilly-pass",
        name: "Uttarakhand Hilly Sector (Garhwal Region)",
        terrain: "Steep Mountainous Slope",
        severity: "warning",
        source: "Geological Survey & BRO Monitoring Cell",
        threatTitle: "Rain-Triggered Landslides & Cloudburst Mudflow",
        threatEta: "18 Hours",
        threatDesc: "Soil saturation levels have exceeded critical limits (85%) due to continuous heavy monsoon rainfall. Active soil slip creep detected near national highway mountain curves.",
        evacStrategy: "Relocate residents from steep slope bungalows. Move towards Joshimath High Plateau. Avoid taking the valley floor expressways.",
        geoAdvantages: [
            "Stable granite bedrock plateau at the top provides a highly secure assembly area.",
            "Local Border Road Organisation (BRO) has active landslide monitoring teams deployed."
        ],
        geoDisadvantages: [
            "Steep gradients (over 45 degrees) allow mudflows to travel at 40 km/h.",
            "Heavy cloud cover and fog block emergency helicopter navigation and air rescue."
        ],
        evacSteps: [
            "Clear outdoor drainage gutters to prevent water build-up behind retaining walls.",
            "Pack personal identity cards and essential medication in a waterproof backpack.",
            "Evacuate upward to the Joshimath Relief safehouse via the Ridge Path."
        ],
        contacts: [
            { name: "Garhwal Disaster Emergency", dept: "Emergency Response", phone: "+91-135-271-0334" },
            { name: "BRO Road Operations Cell", dept: "Geological Survey", phone: "+91-135-266-1020" },
            { name: "Mountain Rescue Helpline", dept: "Volunteers & Search", phone: "108" }
        ],
        shelter: {
            name: "Joshimath Ridge Relief Safehouse",
            address: "Joshimath High School Hall, Badrinath National Highway",
            capacity: "800 Citizens",
            supplies: "Stocked - Temporary beds, blankets, and dry rations ready."
        },
        sensors: {
            param1Name: "Soil Moisture",
            param1Unit: "%",
            param1Base: 86.2,
            param1Trend: 0.12,
            param2Name: "Slope Vibration",
            param2Unit: "mm/s",
            param2Base: 2.1,
            param2Trend: 0.25,
            chartLabel: "Slope Tremor Amplitude (mm/s)"
        },
        coordinates: [30.400, 78.480],
        polygon: [
            [30.480, 78.350],
            [30.490, 78.580],
            [30.290, 78.580],
            [30.280, 78.380]
        ]
    },
    "metro-hub": {
        id: "metro-hub",
        name: "Bihar River Plain (Patna-Kosi Basin)",
        terrain: "Flat Riverine Floodplain",
        severity: "critical",
        source: "Central Water Commission (CWC)",
        threatTitle: "Riverine Flooding & Embankment Breach Alert",
        threatEta: "6 Hours",
        threatDesc: "Water releases from upstream dam reservoirs combined with intense rains have pushed river levels above the danger mark, causing structural threat to embankments.",
        evacStrategy: "Evacuate low-lying river villages immediately. Move towards designated elevated highway embankments or Patna Town shelters.",
        geoAdvantages: [
            "Broad agricultural floodplains absorb high peak river volumes, reducing flow speed.",
            "Pre-fabricated relief tents and food drops are managed actively by Bihar NDRF."
        ],
        geoDisadvantages: [
            "High riverbed silt causes river channels to flow higher than surrounding farmland plains.",
            "Submerged rural connecting bridges prevent vehicle evacuation, requiring boat rescue."
        ],
        evacSteps: [
            "Guide cattle and farming animals to high ridge pastures immediately.",
            "Pack and store household seeds and farming tools in secure elevated watertight bins.",
            "Walk along safety embankments towards Patna Sports Relief Complex."
        ],
        contacts: [
            { name: "Bihar Disaster Operations", dept: "State Control Room", phone: "+91-612-221-7305" },
            { name: "Patna CWC Control Room", dept: "River Level Monitor", phone: "+91-612-223-4050" },
            { name: "Flood Relief Helpline", dept: "NDRF Coordination", phone: "1070" }
        ],
        shelter: {
            name: "Patna Central Relief Camp",
            address: "Sports Stadium Grounds, Kankarbagh Road",
            capacity: "2,500 Citizens",
            supplies: "Stocked - Clean water tanks, mobile kitchens, and vaccination station ready."
        },
        sensors: {
            param1Name: "River Flow Speed",
            param1Unit: "m³/s",
            param1Base: 1420,
            param1Trend: 35,
            param2Name: "River Gauge Height",
            param2Unit: "meters",
            param2Base: 5.6,
            param2Trend: 0.08,
            chartLabel: "Ganges River Gauge Level (m)"
        },
        coordinates: [25.600, 85.120],
        polygon: [
            [25.680, 85.000],
            [25.680, 85.250],
            [25.500, 85.250],
            [25.480, 85.000]
        ]
    },
    "river-basin": {
        id: "river-basin",
        name: "Thar Desert Zone (Western Rajasthan)",
        terrain: "Arid Sandy Desert",
        severity: "advisory",
        source: "State Meteorological Authority",
        threatTitle: "Severe Heatwave & Sandstorm Dust Hazard",
        threatEta: "24 Hours",
        threatDesc: "Temperatures are predicted to exceed 48°C, with high-velocity dry winds generating blinding sandstorms (winds up to 70 km/h) that reduce visibility to near-zero.",
        evacStrategy: "Avoid outdoor travel. Seek shelter inside cool, traditional thick-walled structures or underground cooling rooms. Keep animals protected.",
        geoAdvantages: [
            "Traditional sandstone structures provide high insulation, keeping interiors 8°C cooler.",
            "Ample local community wells (Bawris) provide emergency water supply."
        ],
        geoDisadvantages: [
            "High wind and dust deposits block solar grids and roads, cutting off electrical power.",
            "Extreme evaporation dries up exposed water bodies, leading to direct dehydration risks."
        ],
        evacSteps: [
            "Ensure storage tanks are sealed tightly to prevent sand contamination.",
            "Ensure domestic animals are moved inside covered sheds with wet jute screens.",
            "Stay indoors, keep face covered if traveling, and drink saline ORS water."
        ],
        contacts: [
            { name: "Rajasthan Operations Cell", dept: "Disaster Operations", phone: "+91-141-2227296" },
            { name: "Jaisalmer Control", dept: "District Emergency Cell", phone: "+91-2992-252201" },
            { name: "Public Health Water Line", dept: "Water Supply Cell", phone: "1800-180-6127" }
        ],
        shelter: {
            name: "Jaisalmer Community Cool Haven",
            address: "Fort Ground Community Substructure, Old City",
            capacity: "1,000 Citizens",
            supplies: "Stocked - High-capacity water chillers and saline drip packages."
        },
        sensors: {
            param1Name: "Ambient Temp",
            param1Unit: "°C",
            param1Base: 46.5,
            param1Trend: 0.3,
            param2Name: "Dust Density",
            param2Unit: "mg/m³",
            param2Base: 380,
            param2Trend: 15,
            chartLabel: "Airborne Dust Density (mg/m³)"
        },
        coordinates: [26.910, 70.900],
        polygon: [
            [27.050, 70.750],
            [27.050, 71.050],
            [26.750, 71.050],
            [26.750, 70.750]
        ]
    }
};

// Predefined emergency shelters to plot on the map
const shelterNodes = [
    { name: "Paradip Multi-Purpose Cyclone Shelter", coords: [20.275, 86.620], capacity: "1,800", type: "coastal-plain" },
    { name: "Joshimath Ridge Relief Safehouse", coords: [30.405, 78.495], capacity: "800", type: "hilly-pass" },
    { name: "Patna Central Relief Camp", coords: [25.590, 85.130], capacity: "2,500", type: "metro-hub" },
    { name: "Jaisalmer Community Cool Haven", coords: [26.912, 70.905], capacity: "1,000", type: "river-basin" }
];


// ==========================================================================
// Map Initialization and Rendering Functions
// ==========================================================================

function initMap() {
    // Initialize Leaflet Map centered on India
    state.map = L.map('map', {
        zoomControl: true,
        maxZoom: 18,
        minZoom: 4
    }).setView([21.7679, 78.8718], 5);

    // Use CartoDB Dark Matter tiles for a premium, sleek dark dashboard look
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(state.map);

    // Initialize LayerGroups for filters
    state.hazardLayerGroup = L.layerGroup().addTo(state.map);
    state.shelterLayerGroup = L.layerGroup().addTo(state.map);
    state.citizenLayerGroup = L.layerGroup().addTo(state.map);

    // Plot Hazard Polygons
    plotHazardZones();

    // Plot Emergency Shelters
    plotShelterNodes();

    // Plot Citizen Reports
    plotCitizenReports();

    // Register Map Click for Reporting
    state.map.on('click', handleMapClick);
}

function plotHazardZones() {
    state.hazardLayerGroup.clearLayers();
    Object.values(localitiesData).forEach(loc => {
        let color = '#06b6d4'; // Advisory Cyan
        let fillOpacity = 0.25;

        if (loc.severity === 'critical') {
            color = '#ff4d4d'; // Critical Neon Red
            fillOpacity = 0.35;
        } else if (loc.severity === 'warning') {
            color = '#f59e0b'; // Warning Neon Amber
            fillOpacity = 0.3;
        }

        // Draw Polygon
        const polygonLayer = L.polygon(loc.polygon, {
            color: color,
            fillColor: color,
            fillOpacity: fillOpacity,
            weight: 2,
            dashArray: loc.severity === 'critical' ? '5, 5' : null,
            className: loc.severity === 'critical' ? 'pulse-polygon' : ''
        }).addTo(state.hazardLayerGroup);

        // Bind interactive tooltip
        polygonLayer.bindTooltip(`
            <div style="font-family: Outfit; font-weight:600; color: #fff;">
                <span class="badge badge-${loc.severity}" style="font-size:0.6rem; padding: 2px 4px; border-radius:3px; margin-right:4px;">${loc.severity.toUpperCase()}</span>
                ${loc.name}
            </div>
        `, { sticky: true, opacity: 0.95 });

        // Click interaction
        polygonLayer.on('click', (e) => {
            L.DomEvent.stopPropagation(e); // Stop event from bubbling to map (avoids triggering report mode)
            selectLocality(loc.id);
        });

        // Store reference to highlight later
        state.localityLayers[loc.id] = polygonLayer;
    });
}

function plotShelterNodes() {
    state.shelterLayerGroup.clearLayers();
    const shelterIcon = L.divIcon({
        className: 'custom-shelter-icon',
        html: `<div style="
            background: #10b981;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 2px solid #fff;
            box-shadow: 0 0 10px rgba(16, 185, 129, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
        "><i class="fa-solid fa-hotel" style="color: #fff; font-size: 7px;"></i></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });

    shelterNodes.forEach(shelter => {
        const marker = L.marker(shelter.coords, { icon: shelterIcon }).addTo(state.shelterLayerGroup);
        marker.bindPopup(`
            <div style="font-family: Outfit; min-width: 140px;">
                <h4 style="margin: 0 0 4px 0; color: #fff; font-size: 0.8rem;"><i class="fa-solid fa-hotel" style="color: #10b981;"></i> Safe Shelter</h4>
                <p style="margin: 0; font-size: 0.72rem; color: #cbd5e1;">${shelter.name}</p>
                <p style="margin: 4px 0 0 0; font-size: 0.65rem; color: #94a3b8;">Capacity: ${shelter.capacity} people</p>
                <span class="popup-link" onclick="selectLocality('${shelter.type}')">View Evac Plan</span>
            </div>
        `);
    });
}

function plotCitizenReports() {
    // Clear existing citizen markers in LayerGroup
    state.citizenLayerGroup.clearLayers();
    state.citizenMarkers = [];

    state.citizenReports.forEach(report => {
        let color = '#fd7e14'; // Orange
        if (report.severity === 'critical') color = '#ef4444'; // Red
        else if (report.severity === 'advisory') color = '#06b6d4'; // Cyan

        const reportIcon = L.divIcon({
            className: 'custom-citizen-icon',
            html: `<div style="
                background: ${color};
                width: 14px;
                height: 14px;
                border-radius: 50%;
                border: 2px solid #1e293b;
                box-shadow: 0 0 8px ${color};
                display: flex;
                align-items: center;
                justify-content: center;
            "><i class="fa-solid fa-users" style="color: #fff; font-size: 6px;"></i></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });

        const marker = L.marker([report.lat, report.lng], { icon: reportIcon }).addTo(state.citizenLayerGroup);
        
        let typeLabel = "Community Observation";
        if (report.hazardType === 'flood') typeLabel = "Flash Flood / Water Logging";
        else if (report.hazardType === 'landslide') typeLabel = "Landslide Warning";
        else if (report.hazardType === 'wildfire') typeLabel = "Wildfire Risk";
        else if (report.hazardType === 'seismic') typeLabel = "Ground Cracks/Seismic";
        else if (report.hazardType === 'storm') typeLabel = "Storm / Heavy Winds";

        marker.bindPopup(`
            <div style="font-family: Outfit; min-width: 170px;">
                <h4 style="margin: 0; color: #fff; font-size: 0.82rem; display:flex; align-items:center; gap:4px;">
                    <i class="fa-solid fa-circle-radiation" style="color: ${color};"></i> ${typeLabel}
                </h4>
                <p style="margin: 4px 0; font-size: 0.72rem; color: #cbd5e1;"><strong>Locality:</strong> ${report.locality}</p>
                <p style="margin: 0; font-size: 0.7rem; color: #94a3b8; line-height: 1.3;">${report.desc}</p>
                <div style="margin-top: 6px; padding: 4px; background: rgba(255,255,255,0.05); border-radius: 4px; font-size: 0.65rem; color: #10b981;">
                    <strong>Action:</strong> ${report.solution || "No local action proposed yet."}
                </div>
                <div style="display:flex; align-items:center; justify-content:space-between; margin-top: 8px;">
                    <button class="card-verify-btn" onclick="verifyReport('${report.id}')">
                        <i class="fa-solid fa-check"></i> Verify (${report.verifications || 0})
                    </button>
                    <span style="font-size:0.6rem; color:#64748b;">${report.timestamp}</span>
                </div>
                <div style="margin-top: 4px; font-size: 0.6rem; color: #64748b; text-align: right;">
                    By: ${report.user}
                </div>
            </div>
        `);

        state.citizenMarkers.push(marker);
    });
}

function handleMapClick(e) {
    if (!state.reportingMode) return;

    // Reporting Mode is active. Open reporting modal with coords.
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);

    document.getElementById('report-lat').value = lat;
    document.getElementById('report-lng').value = lng;
    
    // Open Modal
    document.getElementById('report-modal').classList.remove('hidden');

    // Turn off reporting mode indicators
    toggleReportingMode(false);
}

function toggleReportingMode(active) {
    state.reportingMode = active;
    const mapContainer = document.getElementById('map');
    const prompt = document.getElementById('report-instruction');

    if (active) {
        mapContainer.style.cursor = 'crosshair';
        prompt.classList.remove('hidden');
    } else {
        mapContainer.style.cursor = '';
        prompt.classList.add('hidden');
    }
}

// ==========================================================================
// Dashboard Interaction & State Syncing
// ==========================================================================

function selectLocality(localityId) {
    const loc = localitiesData[localityId];
    if (!loc) return;

    state.selectedLocality = loc;

    // Highlight current card in the list
    document.querySelectorAll('.locality-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.id === localityId) {
            card.classList.add('active');
        }
    });

    // Zoom Map to Polygon Bounds
    const layer = state.localityLayers[localityId];
    if (layer) {
        state.map.fitBounds(layer.getBounds(), { padding: [30, 30], maxZoom: 13 });
    }

    // Toggle panels in right sidebar
    document.getElementById('panel-welcome-state').classList.add('hidden');
    document.getElementById('panel-details-state').classList.remove('hidden');

    // Render general details
    document.getElementById('detail-name').innerText = loc.name;
    document.getElementById('detail-terrain-type').innerText = loc.terrain;
    document.getElementById('detail-source').innerText = loc.source;

    // Severity Badge
    const badge = document.getElementById('detail-severity-badge');
    badge.innerText = loc.severity.toUpperCase();
    badge.className = 'badge'; // reset
    badge.classList.add(`badge-${loc.severity}`);

    // Threat details
    document.getElementById('detail-threat-title').innerText = loc.threatTitle;
    document.getElementById('detail-threat-eta').innerHTML = `<i class="fa-regular fa-clock"></i> ETA: ${loc.threatEta}`;
    document.getElementById('detail-threat-desc').innerText = loc.threatDesc;

    // Style threat summary container based on severity
    const threatCard = document.querySelector('.threat-summary-card');
    threatCard.className = 'threat-summary-card'; // reset
    if (loc.severity === 'warning') threatCard.classList.add('warning-style');
    if (loc.severity === 'advisory') threatCard.classList.add('advisory-style');

    // Render Evacuation details
    document.getElementById('detail-evac-strategy').innerText = loc.evacStrategy;

    // Geographical Advantages
    const advList = document.getElementById('detail-geo-advantages');
    advList.innerHTML = '';
    loc.geoAdvantages.forEach(adv => {
        const li = document.createElement('li');
        li.innerText = adv;
        advList.appendChild(li);
    });

    // Geographical Disadvantages
    const disList = document.getElementById('detail-geo-disadvantages');
    disList.innerHTML = '';
    loc.geoDisadvantages.forEach(dis => {
        const li = document.createElement('li');
        li.innerText = dis;
        disList.appendChild(li);
    });

    // Step by step evac plan
    const stepsList = document.getElementById('detail-evac-steps');
    stepsList.innerHTML = '';
    loc.evacSteps.forEach(step => {
        const li = document.createElement('li');
        li.innerText = step;
        stepsList.appendChild(li);
    });

    // Build Tackle Checklist (Before, During, After)
    buildTackleChecklist(localityId);

    // Build Contacts
    const contactsContainer = document.getElementById('detail-contacts');
    contactsContainer.innerHTML = '';
    loc.contacts.forEach(contact => {
        contactsContainer.innerHTML += `
            <div class="contact-card">
                <div class="contact-card-info">
                    <span class="contact-name">${contact.name}</span>
                    <span class="contact-dept">${contact.dept}</span>
                </div>
                <a href="tel:${contact.phone}" class="contact-phone-btn">
                    <i class="fa-solid fa-phone"></i> ${contact.phone}
                </a>
            </div>
        `;
    });

    // Shelter card
    document.getElementById('detail-shelter-name').innerText = loc.shelter.name;
    document.getElementById('detail-shelter-address').innerHTML = `<i class="fa-solid fa-location-dot"></i> ${loc.shelter.address}`;
    document.getElementById('detail-shelter-capacity').innerText = loc.shelter.capacity;
    document.getElementById('detail-shelter-supplies').innerHTML = `<i class="fa-solid fa-circle-check"></i> ${loc.shelter.supplies.split(' - ')[0]}`;

    // Highlight Shelter Button Listener
    document.getElementById('btn-show-shelter').onclick = () => {
        // Find corresponding shelter node
        const node = shelterNodes.find(s => s.type === localityId);
        if (node) {
            state.map.setView(node.coords, 14);
            // Find marker (simple match coords)
            state.map.eachLayer(layer => {
                if (layer instanceof L.Marker && layer.getLatLng) {
                    const latlng = layer.getLatLng();
                    if (Math.abs(latlng.lat - node.coords[0]) < 0.001 && Math.abs(latlng.lng - node.coords[1]) < 0.001) {
                        layer.openPopup();
                    }
                }
            });
        }
    };

    // Render & Run Telemetry Sensors Simulation
    setupSensorTelemetry(loc);
}

function buildTackleChecklist(localityId) {
    const checklists = {
        "coastal-plain": {
            before: ["Tape large glass windows in criss-cross pattern.", "Move boats & coastal tools to elevated concrete shed.", "Fill primary vehicle fuel tank fully.", "Check battery charging on radios and backup batteries."],
            during: ["Disconnect central electricity mains to avoid fire/shock.", "Stay away from windows and sit on floor in center room.", "Do not venture out during wind lulls (eye of cyclone)."],
            after: ["Boil all tap water or drink bottled resources.", "Inspect building structure for stability cracks before entering.", "Avoid driving/walking through flood currents."]
        },
        "hilly-pass": {
            before: ["Check landslide triggers for tilting walls or fence posts.", "Pack documents, meds, dry food, and power bank in go-bag.", "Inspect mud retainer wall drains for soil blockages."],
            during: ["If hearing a low rumble, move away from slopes immediately.", "Stay out of basement rooms to prevent mud traps.", "Evacuate laterally to flat plateau zones."],
            after: ["Stay clear of mudflow areas (secondary slides are common).", "Check for ruptured power or pipeline lines on slopes.", "Wait for disaster officer clearance before re-occupying homes."]
        },
        "metro-hub": {
            before: ["Move agricultural livestock and pumps to high embankments.", "Store dry grains in airtight elevated storage structures.", "Verify river warning markers with local authority announcements."],
            during: ["Move immediately to elevated embankment ridges or rooftops.", "Avoid wading or swimming in fast river currents.", "Monitor flood broadcast channel alerts constantly."],
            after: ["Chlorinate open well water resources before general use.", "Beware of water snakes and scorpions in flooded houses.", "Wait for administrative clearance before returning home."]
        },
        "river-basin": {
            before: ["Store a minimum of 50 liters of drinking water per person.", "Ensure animal sheds are sealed against dry sand drafts.", "Verify functioning of cooling fans and battery generator units."],
            during: ["Stay inside cool sandstone insulated rooms.", "Hydrate hourly with ORS or cool water.", "Avoid traveling outdoors during peak hot hours or active storm."],
            after: ["Examine domestic animals for symptoms of heat exhaustion.", "Clear solar power installations of heavy sand dust.", "Inspect public water pipelines for leaks and report immediately."]
        }
    };

    const lists = checklists[localityId] || { before: [], during: [], after: [] };

    const renderList = (elementId, items) => {
        const container = document.getElementById(elementId);
        container.innerHTML = '';
        items.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'check-item';
            li.innerHTML = `
                <input type="checkbox" id="${elementId}-${index}">
                <span>${item}</span>
            `;

            // Toggle strike class on click
            li.addEventListener('click', (e) => {
                const checkbox = li.querySelector('input');
                if (e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                }
                if (checkbox.checked) {
                    li.classList.add('completed');
                } else {
                    li.classList.remove('completed');
                }
            });
            container.appendChild(li);
        });
    };

    renderList('checklist-before', lists.before);
    renderList('checklist-during', lists.during);
    renderList('checklist-after', lists.after);
}

// ==========================================================================
// Chart.js - Real-Time Telemetry Simulation
// ==========================================================================

function setupSensorTelemetry(loc) {
    // Clear existing interval
    if (state.sensorIntervalId) {
        clearInterval(state.sensorIntervalId);
    }

    // Reset UI Stat nodes text
    document.getElementById('sensor-param-1-name').innerText = loc.sensors.param1Name;
    document.getElementById('sensor-param-2-name').innerText = loc.sensors.param2Name;

    let sensorVal1 = loc.sensors.param1Base;
    let sensorVal2 = loc.sensors.param2Base;

    document.getElementById('sensor-param-1-val').innerText = `${sensorVal1.toFixed(1)} ${loc.sensors.param1Unit}`;
    document.getElementById('sensor-param-2-val').innerText = `${sensorVal2.toFixed(1)} ${loc.sensors.param2Unit}`;

    // Set styling based on severity
    const val2Node = document.getElementById('sensor-param-2-val');
    val2Node.className = 'stat-val';
    if (loc.severity === 'critical') val2Node.classList.add('critical');
    else if (loc.severity === 'warning') val2Node.classList.add('warning');

    // Chart mock dataset
    const labelCount = 8;
    const labels = [];
    const dataPoints = [];
    
    let now = new Date();
    for (let i = labelCount - 1; i >= 0; i--) {
        let pastTime = new Date(now.getTime() - i * 5000); // 5 sec intervals
        labels.push(pastTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        // Add slightly lower historical values
        let factor = 1 - (i * 0.02);
        dataPoints.push(parseFloat((sensorVal2 * factor).toFixed(2)));
    }

    // Destroy old Chart instance if exists
    if (state.sensorChart) {
        state.sensorChart.destroy();
    }

    // Chart Configuration
    const ctx = document.getElementById('sensorChart').getContext('2d');
    
    let chartColor = '#06b6d4'; // Cyan
    let chartGlow = 'rgba(6, 182, 212, 0.2)';
    if (loc.severity === 'critical') {
        chartColor = '#ff4d4d'; // Red
        chartGlow = 'rgba(255, 77, 77, 0.2)';
    } else if (loc.severity === 'warning') {
        chartColor = '#f59e0b'; // Amber
        chartGlow = 'rgba(245, 158, 11, 0.2)';
    }

    state.sensorChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: loc.sensors.chartLabel,
                data: dataPoints,
                borderColor: chartColor,
                backgroundColor: chartGlow,
                fill: true,
                tension: 0.3,
                borderWidth: 2,
                pointRadius: 2,
                pointHoverRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#64748b', font: { size: 9, family: 'Plus Jakarta Sans' } }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#64748b', font: { size: 9, family: 'Plus Jakarta Sans' } }
                }
            }
        }
    });

    // Run active telemetry updates
    state.sensorIntervalId = setInterval(() => {
        // Randomly simulate small changes trending upwards
        const trend1 = (Math.random() - 0.35) * loc.sensors.param1Trend;
        const trend2 = (Math.random() - 0.35) * loc.sensors.param2Trend;

        sensorVal1 += trend1;
        sensorVal2 += trend2;

        // Caps
        if (sensorVal1 < 0) sensorVal1 = 0;
        if (sensorVal2 < 0) sensorVal2 = 0;

        // Update Text Nodes
        document.getElementById('sensor-param-1-val').innerText = `${sensorVal1.toFixed(1)} ${loc.sensors.param1Unit}`;
        document.getElementById('sensor-param-2-val').innerText = `${sensorVal2.toFixed(1)} ${loc.sensors.param2Unit}`;

        // Shift Chart Data
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        state.sensorChart.data.labels.shift();
        state.sensorChart.data.labels.push(timeStr);

        state.sensorChart.data.datasets[0].data.shift();
        state.sensorChart.data.datasets[0].data.push(parseFloat(sensorVal2.toFixed(2)));

        state.sensorChart.update('none'); // silent update without full re-render animation
    }, 3000);
}

// ==========================================================================
// Community & Citizen Report Form Handling
// ==========================================================================

function handleFormSubmit(e) {
    e.preventDefault();

    const localityName = document.getElementById('report-locality').value;
    const hazardType = document.getElementById('report-hazard-type').value;
    const severity = document.getElementById('report-severity').value;
    const desc = document.getElementById('report-desc').value;
    const solution = document.getElementById('report-solution').value;
    const lat = parseFloat(document.getElementById('report-lat').value);
    const lng = parseFloat(document.getElementById('report-lng').value);

    // Create New Report Object
    const newReport = {
        id: `cr-${Date.now()}`,
        lat: lat,
        lng: lng,
        locality: localityName,
        hazardType: hazardType,
        severity: severity,
        desc: desc,
        solution: solution,
        timestamp: "Just now",
        user: "You (Citizen)",
        verifications: 0
    };

    // Prepend to array
    state.citizenReports.unshift(newReport);

    // Save to LocalStorage
    localStorage.setItem('predictit_citizen_reports', JSON.stringify(state.citizenReports));

    // Render reports lists
    renderCitizenReportsList();

    // Plot on Map
    plotCitizenReports();

    // Increment dashboard reports counts
    updateDashboardMetrics();

    // Close Modal
    document.getElementById('report-modal').classList.add('hidden');
    document.getElementById('hazard-report-form').reset();

    // Focus map on new marker
    state.map.setView([lat, lng], 13);
}

function renderCitizenReportsList() {
    const container = document.getElementById('community-reports-container');
    container.innerHTML = '';

    state.citizenReports.forEach(report => {
        let badgeColor = "badge-warning";
        if (report.severity === 'critical') badgeColor = "badge-critical";
        else if (report.severity === 'advisory') badgeColor = "badge-advisory";

        let icon = "fa-triangle-exclamation";
        if (report.hazardType === 'flood') icon = "fa-droplet";
        else if (report.hazardType === 'landslide') icon = "fa-mountain";
        else if (report.hazardType === 'wildfire') icon = "fa-fire-flame-curved";
        else if (report.hazardType === 'seismic') icon = "fa-house-crack";
        else if (report.hazardType === 'storm') icon = "fa-wind";

        const card = document.createElement('div');
        card.className = 'report-card';
        card.innerHTML = `
            <div class="report-card-meta">
                <span class="location"><i class="fa-solid ${icon}"></i> ${report.locality}</span>
                <span class="badge ${badgeColor}">${report.severity}</span>
            </div>
            <p class="report-card-desc">${report.desc}</p>
            <div class="report-card-footer">
                <span>By: ${report.user}</span>
                <button class="card-verify-btn" data-id="${report.id}"><i class="fa-solid fa-circle-check"></i> Verify (${report.verifications || 0})</button>
                <span>${report.timestamp}</span>
            </div>
        `;

        card.querySelector('.card-verify-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            verifyReport(report.id);
        });

        card.addEventListener('click', (e) => {
            state.map.setView([report.lat, report.lng], 13);
            // Highlight marker by opening popup in layer group
            state.citizenLayerGroup.eachLayer(layer => {
                if (layer instanceof L.Marker && layer.getLatLng) {
                    const latlng = layer.getLatLng();
                    if (Math.abs(latlng.lat - report.lat) < 0.0001 && Math.abs(latlng.lng - report.lng) < 0.0001) {
                        layer.openPopup();
                    }
                }
            });
        });

        container.appendChild(card);
    });
}

function updateDashboardMetrics() {
    // Counts
    let activeThreats = Object.values(localitiesData).filter(l => l.severity !== 'advisory').length;
    let citizenReportsCount = state.citizenReports.length;
    let safeSheltersCount = shelterNodes.length;

    document.getElementById('count-active').innerText = activeThreats;
    document.getElementById('count-reports').innerText = citizenReportsCount;
    document.getElementById('count-safe').innerText = safeSheltersCount;
}

// ==========================================================================
// Initialization & Search Autocomplete
// ==========================================================================

function initLocalitiesList() {
    const container = document.getElementById('localities-container');
    container.innerHTML = '';

    Object.values(localitiesData).forEach(loc => {
        let badgeColor = "badge-advisory";
        if (loc.severity === 'critical') badgeColor = "badge-critical";
        else if (loc.severity === 'warning') badgeColor = "badge-warning";

        let icon = "fa-triangle-exclamation";
        if (loc.id === 'coastal-plain') icon = "fa-cloud-showers-heavy";
        else if (loc.id === 'hilly-pass') icon = "fa-mountain";
        else if (loc.id === 'metro-hub') icon = "fa-city";
        else if (loc.id === 'river-basin') icon = "fa-water";

        const card = document.createElement('div');
        card.className = 'locality-card';
        card.dataset.id = loc.id;
        card.innerHTML = `
            <div class="locality-card-header">
                <h4>${loc.name}</h4>
                <span class="badge ${badgeColor}">${loc.severity}</span>
            </div>
            <div class="locality-card-body">
                <span class="threat-type"><i class="fa-solid ${icon}"></i> ${loc.threatTitle.split(' & ')[0]}</span>
                <span class="eta"><i class="fa-regular fa-clock"></i> ${loc.threatEta}</span>
            </div>
        `;

        card.addEventListener('click', () => {
            selectLocality(loc.id);
        });

        container.appendChild(card);
    });
}

function initSearch() {
    const searchInput = document.getElementById('locality-search');
    const suggestionsBox = document.getElementById('search-suggestions');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length === 0) {
            suggestionsBox.classList.add('hidden');
            return;
        }

        // Search through database and citizen reports
        const results = [];

        // Match Official Localities
        Object.values(localitiesData).forEach(loc => {
            if (loc.name.toLowerCase().includes(query) || loc.terrain.toLowerCase().includes(query) || loc.threatTitle.toLowerCase().includes(query)) {
                results.push({
                    name: loc.name,
                    type: "Official Zone",
                    id: loc.id,
                    isOfficial: true
                });
            }
        });

        // Match Citizen reports
        state.citizenReports.forEach(rep => {
            if (rep.locality.toLowerCase().includes(query) || rep.desc.toLowerCase().includes(query)) {
                results.push({
                    name: rep.locality,
                    type: "Citizen Alert",
                    lat: rep.lat,
                    lng: rep.lng,
                    isOfficial: false
                });
            }
        });

        // Render Suggestions
        if (results.length > 0) {
            suggestionsBox.innerHTML = '';
            results.forEach(res => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.innerHTML = `
                    <span class="name">${res.name}</span>
                    <span class="type">${res.type}</span>
                `;
                div.addEventListener('click', () => {
                    searchInput.value = res.name;
                    suggestionsBox.classList.add('hidden');

                    if (res.isOfficial) {
                        selectLocality(res.id);
                    } else {
                        state.map.setView([res.lat, res.lng], 13);
                        // find and open citizen marker
                        state.map.eachLayer(layer => {
                            if (layer instanceof L.Marker && layer.getLatLng) {
                                const latlng = layer.getLatLng();
                                if (Math.abs(latlng.lat - res.lat) < 0.0001 && Math.abs(latlng.lng - res.lng) < 0.0001) {
                                    layer.openPopup();
                                }
                            }
                        });
                    }
                });
                suggestionsBox.appendChild(div);
            });
            suggestionsBox.classList.remove('hidden');
        } else {
            suggestionsBox.classList.add('hidden');
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.classList.add('hidden');
        }
    });
}

function initEventHandlers() {
    // System Live Time Clock
    setInterval(() => {
        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        document.getElementById('live-time').innerText = timeString;
    }, 1000);

    // Tab switcher in right sidebar details panel
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

            // Add active
            tab.classList.add('active');
            const targetPanelId = tab.dataset.tab;
            document.getElementById(targetPanelId).classList.add('active');
        });
    });

    // Report Hazard Buttons
    document.getElementById('btn-report-hazard').addEventListener('click', () => {
        toggleReportingMode(true);
    });

    document.getElementById('btn-cancel-report').addEventListener('click', () => {
        toggleReportingMode(false);
    });

    // Modal close controls
    document.getElementById('btn-close-modal').addEventListener('click', () => {
        document.getElementById('report-modal').classList.add('hidden');
    });

    document.getElementById('btn-modal-cancel').addEventListener('click', () => {
        document.getElementById('report-modal').classList.add('hidden');
    });

    // Form Submission
    document.getElementById('hazard-report-form').addEventListener('submit', handleFormSubmit);
}

// ==========================================================================
// Initialization Entry Point
// ==========================================================================

// ==========================================================================
// Predict It - Citizen Verification & Preparedness Quiz Logic
// ==========================================================================

window.verifyReport = function(reportId) {
    const report = state.citizenReports.find(r => r.id === reportId);
    if (report) {
        const verifiedKey = `verified_${reportId}`;
        if (sessionStorage.getItem(verifiedKey)) {
            alert("You have already verified this hazard prediction in this session.");
            return;
        }

        report.verifications = (report.verifications || 0) + 1;
        sessionStorage.setItem(verifiedKey, "true");

        // Save to localStorage
        localStorage.setItem('predictit_citizen_reports', JSON.stringify(state.citizenReports));

        // Re-render
        renderCitizenReportsList();
        plotCitizenReports();
    }
};

const quizQuestions = [
    {
        q: "If a Category 4 Cyclone is approaching, what should you do with glass windows?",
        options: [
            "Keep them open fully to balance indoor and outdoor air pressure.",
            "Board them up with plywood or tape them in a strong criss-cross pattern.",
            "Cover them with aluminum foil to reflect wind energy."
        ],
        correctIndex: 1,
        explanation: "Plywood shutters or heavy-duty tape prevent high-speed debris from shattering windows and letting strong winds inside, which can lift the roof."
    },
    {
        q: "Which is a major indicator of an impending landslide on a slope?",
        options: [
            "Fences, trees, or utility poles beginning to tilt or lean.",
            "Earthworms crawling out of the soil in large numbers.",
            "Local rivers flowing unusually clear."
        ],
        correctIndex: 0,
        explanation: "Tilting structures indicate soil creeping or structural failure of the slope, signaling that a landslide is imminent."
    },
    {
        q: "What should you do if you are caught driving through a flooded area and water levels rise?",
        options: [
            "Stay inside the vehicle and wait for rescue.",
            "Drive faster to push through the water before the engine stalls.",
            "Abandon the vehicle immediately if water reaches the door height and move to high ground."
        ],
        correctIndex: 2,
        explanation: "Cars can easily float and be swept away by fast-moving water. Abandoning the vehicle for higher ground is the safest action."
    },
    {
        q: "During a severe cyclone, what does a sudden calm lull in wind speed indicate?",
        options: [
            "The storm has passed completely and it is safe to go outside.",
            "The eye of the cyclone is passing over; severe winds will return from the opposite direction soon.",
            "The cyclone has lost energy and downgraded to a depression."
        ],
        correctIndex: 1,
        explanation: "The eye of a cyclone is calm, but it is surrounded by the eyewall with the strongest winds. The storm is only half over; stay indoors."
    },
    {
        q: "What is the best way to protect domestic animals during an extreme desert heatwave?",
        options: [
            "Keep them active to build up heat resistance.",
            "Move them inside covered sheds with wet jute screen covers.",
            "Bath them in ice-cold water multiple times a day."
        ],
        correctIndex: 1,
        explanation: "Shaded spaces with wet screens provide evaporative cooling, preventing heat exhaustion. Sudden ice baths can trigger thermal shock."
    }
];

let quizState = {
    currentQuestionIndex: 0,
    score: 0
};

function startQuiz() {
    quizState.currentQuestionIndex = 0;
    quizState.score = 0;
    showQuestion();
}

function showQuestion() {
    const qObj = quizQuestions[quizState.currentQuestionIndex];
    document.getElementById('quiz-progress-text').innerText = `Question ${quizState.currentQuestionIndex + 1} of ${quizQuestions.length}`;
    document.getElementById('quiz-score-badge').innerText = `Score: ${quizState.score}`;
    document.getElementById('quiz-question').innerText = qObj.q;

    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';

    qObj.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.innerText = opt;
        btn.addEventListener('click', () => handleOptionClick(index, btn));
        optionsContainer.appendChild(btn);
    });

    document.getElementById('quiz-feedback').classList.add('hidden');
}

function handleOptionClick(selectedIndex, clickedBtn) {
    const qObj = quizQuestions[quizState.currentQuestionIndex];
    const optionsContainer = document.getElementById('quiz-options');
    const buttons = optionsContainer.querySelectorAll('.quiz-option-btn');

    buttons.forEach(b => b.disabled = true);

    const feedbackBox = document.getElementById('quiz-feedback');
    const feedbackText = document.getElementById('quiz-feedback-text');

    if (selectedIndex === qObj.correctIndex) {
        clickedBtn.classList.add('correct');
        quizState.score++;
        feedbackText.innerHTML = `<strong><i class="fa-solid fa-circle-check text-success"></i> Correct!</strong><br>${qObj.explanation}`;
    } else {
        clickedBtn.classList.add('incorrect');
        buttons[qObj.correctIndex].classList.add('correct');
        feedbackText.innerHTML = `<strong><i class="fa-solid fa-circle-xmark text-critical"></i> Incorrect.</strong><br>${qObj.explanation}`;
    }

    document.getElementById('quiz-score-badge').innerText = `Score: ${quizState.score}`;
    feedbackBox.classList.remove('hidden');
}

function showResults() {
    document.getElementById('quiz-question-box').classList.add('hidden');
    const resultsBox = document.getElementById('quiz-results');
    resultsBox.classList.remove('hidden');

    document.getElementById('quiz-final-score').innerText = `Your score: ${quizState.score} / ${quizQuestions.length}`;

    const rankVal = document.getElementById('quiz-rank-value');
    const rankDesc = document.getElementById('quiz-rank-desc');

    rankVal.className = 'badge'; // reset
    if (quizState.score === quizQuestions.length) {
        rankVal.innerText = 'Survival Expert';
        rankVal.classList.add('badge-success');
        rankDesc.innerText = 'Exceptional understanding! You are highly prepared to lead and guide other citizens during emergency events.';
    } else if (quizState.score >= 3) {
        rankVal.innerText = 'Community Advisor';
        rankVal.classList.add('badge-warning');
        rankDesc.innerText = 'Good knowledge. You understand primary safety measures, but keep reviewing local mitigation guides.';
    } else {
        rankVal.innerText = 'Rookie Citizen';
        rankVal.classList.add('badge-critical');
        rankDesc.innerText = 'Vulnerable to disaster risks. Please read the quick guides and locality plans immediately to ensure safety.';
    }
}

function initPrepCenterHandlers() {
    // Prep Center Tabs
    const prepTabs = document.querySelectorAll('.prep-tab-btn');
    prepTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            prepTabs.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.prep-tab-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const target = btn.dataset.prepTab;
            document.getElementById(target).classList.add('active');
        });
    });

    // Quick Guide Collapsibles (Accordion)
    const guideTitles = document.querySelectorAll('.guide-title');
    guideTitles.forEach(title => {
        title.addEventListener('click', () => {
            const item = title.parentElement;
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.guide-item').forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Quiz Start & Navigation
    const btnStart = document.getElementById('btn-start-quiz');
    const btnNext = document.getElementById('btn-next-question');
    const btnRestart = document.getElementById('btn-restart-quiz');

    if (btnStart) {
        btnStart.addEventListener('click', () => {
            document.getElementById('quiz-intro').classList.add('hidden');
            document.getElementById('quiz-question-box').classList.remove('hidden');
            startQuiz();
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            quizState.currentQuestionIndex++;
            if (quizState.currentQuestionIndex < quizQuestions.length) {
                showQuestion();
            } else {
                showResults();
            }
        });
    }

    if (btnRestart) {
        btnRestart.addEventListener('click', () => {
            document.getElementById('quiz-results').classList.add('hidden');
            document.getElementById('quiz-question-box').classList.remove('hidden');
            startQuiz();
        });
    }
}

function initCollapseToggles() {
    const leftBtn = document.getElementById('toggle-left-panel');
    const rightBtn = document.getElementById('toggle-right-panel');
    const leftPanel = document.querySelector('.left-panel');
    const rightPanel = document.querySelector('.right-panel');

    leftBtn.addEventListener('click', () => {
        leftPanel.classList.toggle('collapsed');
        const icon = leftBtn.querySelector('i');
        if (leftPanel.classList.contains('collapsed')) {
            icon.className = 'fa-solid fa-chevron-right';
            leftBtn.setAttribute('title', 'Expand Left Panel');
        } else {
            icon.className = 'fa-solid fa-chevron-left';
            leftBtn.setAttribute('title', 'Toggle Left Panel');
        }
        setTimeout(() => state.map.invalidateSize(), 310);
    });

    rightBtn.addEventListener('click', () => {
        rightPanel.classList.toggle('collapsed');
        const icon = rightBtn.querySelector('i');
        if (rightPanel.classList.contains('collapsed')) {
            icon.className = 'fa-solid fa-chevron-left';
            rightBtn.setAttribute('title', 'Expand Right Panel');
        } else {
            icon.className = 'fa-solid fa-chevron-right';
            rightBtn.setAttribute('title', 'Toggle Right Panel');
        }
        setTimeout(() => state.map.invalidateSize(), 310);
    });
}

function initFilterHandlers() {
    const filterOfficial = document.getElementById('filter-official');
    const filterShelters = document.getElementById('filter-shelters');
    const filterCitizen = document.getElementById('filter-citizen');

    filterOfficial.addEventListener('change', (e) => {
        if (e.target.checked) {
            state.map.addLayer(state.hazardLayerGroup);
        } else {
            state.map.removeLayer(state.hazardLayerGroup);
        }
    });

    filterShelters.addEventListener('change', (e) => {
        if (e.target.checked) {
            state.map.addLayer(state.shelterLayerGroup);
        } else {
            state.map.removeLayer(state.shelterLayerGroup);
        }
    });

    filterCitizen.addEventListener('change', (e) => {
        if (e.target.checked) {
            state.map.addLayer(state.citizenLayerGroup);
        } else {
            state.map.removeLayer(state.citizenLayerGroup);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Leaflet Map
    initMap();

    // Populate official hazards list
    initLocalitiesList();

    // Populate citizen predictions list
    renderCitizenReportsList();

    // Initialize metrics card text values
    updateDashboardMetrics();

    // Initialize autocomplete search input listener
    initSearch();

    // Bind panel tabs and system click triggers
    initEventHandlers();

    // Initialize Preparedness Center tabs and collapsibles
    initPrepCenterHandlers();

    // Initialize Collapsible Panel side triggers
    initCollapseToggles();

    // Initialize Map Layer Filters
    initFilterHandlers();
});
