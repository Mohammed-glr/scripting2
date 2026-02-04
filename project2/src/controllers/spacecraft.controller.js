// Initial state for reset
const initialState = {
  battery: 85,
  sensors: {
    temperature: true,
    camera: true,
    radar: false,
    oxygen: true
  },
  resources: ['IJzererts', 'Zilver'],
  position: 'Stationary',
  mode: 'Active'
};

// In-memory state for the spacecraft
let spacecraftState = { ...initialState };

// Action history 
let actionHistory = []; // leeg array om acties bij te houden

// Handle GET /status
export const getStatus = (req, res) => {
  const activeSensors = Object.keys(spacecraftState.sensors).filter(
    sensor => spacecraftState.sensors[sensor]
  );

  res.json({
    battery: spacecraftState.battery,
    activeSensors: activeSensors,
    resources: spacecraftState.resources,
    position: spacecraftState.position,
    mode: spacecraftState.mode
  });
};


// Handle POST /action
export const postAction = (req, res) => {
  const { action, sensors } = req.body;
  const timestamp = new Date().toISOString();

  // Handle movement actions ( switch statements )
  switch (action) {
    case 'forward':
      spacecraftState.position = 'Moving forward';
      spacecraftState.battery = Math.max(0, spacecraftState.battery - 2);
      break;
    case 'backward':
      spacecraftState.position = 'Moving backward';
      spacecraftState.battery = Math.max(0, spacecraftState.battery - 2);
      break;
    case 'left':
      spacecraftState.position = 'Turning left';
      spacecraftState.battery = Math.max(0, spacecraftState.battery - 1);
      break;
    case 'right':
      spacecraftState.position = 'Turning right';
      spacecraftState.battery = Math.max(0, spacecraftState.battery - 1)
      break;
    case 'sleep':
      spacecraftState.mode = 'Slaap mode';
      // alle sensores uit in slaap mode
      Object.keys(spacecraftState.sensors).forEach(sensors => {
        spacecraftState.sensors[sensors] = false
      });
      break;
    case 'wake':
        spacecraftState.mode = 'Active'
      break;
    case 'stop':
      spacecraftState.position = 'Stationary'
      break;
  }

  // Handle sensor knoppen
  if (sensors && spacecraftState.mode !== 'Sleep mode') {
    // Reset alle sensors naar false eerst
    Object.keys(spacecraftState.sensors).forEach(sensor => {
      spacecraftState.sensors[sensor] = false;
    });
    
    // Zet geselecteerde sensors op true
    if (Array.isArray(sensors)) {
      sensors.forEach(sensor => {
        if (spacecraftState.sensors.hasOwnProperty(sensor)) {
          spacecraftState.sensors[sensor] = true;
        }
      });
    } else {
      // Single sensor
      if (spacecraftState.sensors.hasOwnProperty(sensors)) {
        spacecraftState.sensors[sensors] = true;
      }
    }
  }

  const activeSensors = Object.keys(spacecraftState.sensors).filter(
    sensor => spacecraftState.sensors[sensor]
  );

  // Log action naar geschiedenis
  actionHistory.push({
    timestamp,
    action,
    sensors: Array.isArray(sensors) ? sensors : [sensors],
    batteryAfter: spacecraftState.battery,
    positionAfter: spacecraftState.position,
    modeAfter: spacecraftState.mode
  });

  res.json({
    success: true,
    message: `Action "${action}" executed successfully`,
    currentStatus: {
      battery: spacecraftState.battery,
      activeSensors: activeSensors,
      resources: spacecraftState.resources,
      position: spacecraftState.position,
      mode: spacecraftState.mode
    }
  });
};



// Handle GET /history
export const getHistory = (req, res) => {
  res.json({
    totalActions: actionHistory.length,
    history: actionHistory
  });
};

// Handle POST /reset
export const resetSpacecraft = (req, res) => {
  // Reset state naar initial values
  spacecraftState = {
    battery: initialState.battery,
    sensors: { ...initialState.sensors },
    resources: [...initialState.resources],
    position: initialState.position,
    mode: initialState.mode
  };

  // Log reset action
  actionHistory.push({
    timestamp: new Date().toISOString(),
    action: 'reset',
    sensors: [],
    batteryAfter: spacecraftState.battery,
    positionAfter: spacecraftState.position,
    modeAfter: spacecraftState.mode
  });

  res.json({
    success: true,
    message: 'Spacecraft has been reset to initial state',
    currentStatus: {
      battery: spacecraftState.battery,
      activeSensors: Object.keys(spacecraftState.sensors).filter(s => spacecraftState.sensors[s]),
      resources: spacecraftState.resources,
      position: spacecraftState.position,
      mode: spacecraftState.mode
    }
  });
};

// Handle POST /emergency-stop
export const emergencyStop = (req, res) => {
  // zet alle systemen uit
  spacecraftState.position = 'Stationary';
  spacecraftState.mode = 'Emergency Stop';
  spacecraftState.battery = Math.max(0, spacecraftState.battery - 5);
  
  // alle sensors uitzetten
  Object.keys(spacecraftState.sensors).forEach(sensor => {
    spacecraftState.sensors[sensor] = false;
  });

  // Log emergency stop
  actionHistory.push({
    timestamp: new Date().toISOString(),
    action: 'emergency-stop',
    sensors: [],
    batteryAfter: spacecraftState.battery,
    positionAfter: spacecraftState.position,
    modeAfter: spacecraftState.mode
  });

  res.json({
    success: true,
    message: 'EMERGENCY STOP ACTIVATED - All systems disabled',
    currentStatus: {
      battery: spacecraftState.battery,
      activeSensors: [],
      resources: spacecraftState.resources,
      position: spacecraftState.position,
      mode: spacecraftState.mode
    }
  });
};