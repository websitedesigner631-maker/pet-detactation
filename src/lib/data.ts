import type { EmergencyResource } from './types';

export const emergencyResources: EmergencyResource[] = [
    {id: 'e1', type: 'Hospital', title: '24/7 Emergency Animal Hospital', content: '456 Main Avenue, Yourtown. Open all hours for critical emergencies.', phone: '123-456-7891'},
    {id: 'e2', type: 'First Aid', title: 'Pet Choking First Aid', content: '1. Open pet\'s mouth, check for objects. 2. If visible, try to remove with fingers or pliers. 3. If not, perform Heimlich maneuver for pets. Call vet immediately.'},
    {id: 'e3', type: 'First Aid', title: 'Bleeding Control', content: '1. Apply firm, direct pressure to the wound with a clean cloth. 2. If bleeding is severe, elevate the limb. 3. Do not remove the cloth; add more layers if needed. Go to the nearest vet.'},
];
