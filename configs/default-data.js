import User from '../src/user/user.model.js';

import Subject from '../src/subject/subject.model.js';

export const createDefaultAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'ADMIN_ROLE' });
        if (adminExists) {
            console.log('Admin por defecto ya existe.');
            return;
        }

        const admin = new User({
            azureId: 'acd9b024-47c2-489e-a0db-994c6fb1419c',
            name: 'José David Figueroa Muñoz',
            username: 'jfigueroa-2023015',
            email: 'jfigueroa-2023015@kinal.edu.gt',
            role: 'ADMIN_ROLE',
            rating: 5
        });

            await admin.save();
            console.log('Admin por defecto creado.');
    } catch (error) {
            console.error('Error creando admin por defecto:', error);
    }
};

export const createDefaultSubject = async () => {
    try {
        const subjectExists = await Subject.findOne({ name: 'Matemática' });
        if (subjectExists) {
            console.log('Materia por defecto ya existe.');
            return;
        }

        const subject = new Subject({
            name: 'Matemática',
            description: 'Matemática 1',
            code: 'PE4MT',
            grade: '4to',
            img: 'https://res.cloudinary.com/dibe6yrzf/image/upload/v1751771469/mate_srkkdc.png',
            teachers: [],
            status: true
        });

        await subject.save();
        console.log('Materia por defecto creada.');
    } catch (error) {
        console.error('Error creando materia por defecto:', error);
    }
}
