import User from '../src/user/user.model.js';

export const createDefaultAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'ADMIN_ROLE' });
        if (adminExists) {
            console.log('Admin por defecto ya existe.');
            return;
        }

        const admin = new User({
            azureId: 'admin-azure-id',
            name: 'Admin',
            email: 'admin@bluebrain.com',
            role: 'ADMIN_ROLE',
            rating: 5
        });

            await admin.save();
            console.log('Admin por defecto creado.');
    } catch (error) {
            console.error('Error creando admin por defecto:', error);
    }
};