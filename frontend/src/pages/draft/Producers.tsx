import React from 'react';
import { MapPin, Award, Users, Heart } from 'lucide-react';

const Producers: React.FC = () => {
  const producers = [
    {
      id: '1',
      name: 'Ferme Ben Ali',
      location: 'Mahdia, Tunisie',
      experience: '25 ans',
      specialty: 'Mloukhia Premium',
      image: 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      description: 'Spécialisée dans la culture biologique de mloukhia depuis trois générations.',
      certifications: ['Bio', 'Commerce Équitable', 'Qualité Premium']
    },
    {
      id: '2',
      name: 'Coopérative El Baraka',
      location: 'Monastir, Tunisie',
      experience: '15 ans',
      specialty: 'Mloukhia Bio',
      image: 'https://images.pexels.com/photos/4503270/pexels-photo-4503270.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      description: 'Regroupement de 50 familles d\'agriculteurs pratiquant l\'agriculture durable.',
      certifications: ['Bio Certifié', 'Agriculture Durable', 'Tradition Locale']
    },
    {
      id: '3',
      name: 'Domaine Sidi Bouzid',
      location: 'Sfax, Tunisie',
      experience: '30 ans',
      specialty: 'Mloukhia Traditionnelle',
      image: 'https://images.pexels.com/photos/4503275/pexels-photo-4503275.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      description: 'Préservation des méthodes ancestrales de culture et de séchage.',
      certifications: ['Tradition Ancestrale', 'Qualité Artisanale', 'Séchage Solaire']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">Nos producteurs partenaires</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Découvrez les familles d'agriculteurs tunisiens qui cultivent avec passion 
              notre mloukhia selon les traditions ancestrales
            </p>
          </div>
        </div>
      </section>

      {/* Producers Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {producers.map((producer) => (
              <div key={producer.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={producer.image}
                  alt={producer.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{producer.name}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{producer.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Award className="h-4 w-4 mr-2" />
                    <span>{producer.experience} d'expérience</span>
                  </div>
                  <p className="text-gray-700 mb-4">{producer.description}</p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Spécialité:</h4>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {producer.specialty}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Certifications:</h4>
                    <div className="flex flex-wrap gap-2">
                      {producer.certifications.map((cert, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Engagement Partenaire</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nous travaillons main dans la main avec nos producteurs pour garantir 
              qualité, durabilité et équité
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Commerce Équitable</h3>
              <p className="text-gray-600">
                Prix justes et partenariats durables avec nos producteurs locaux
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Soutien Communautaire</h3>
              <p className="text-gray-600">
                Accompagnement technique et formation continue de nos partenaires
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Qualité Garantie</h3>
              <p className="text-gray-600">
                Contrôles qualité rigoureux et respect des standards les plus élevés
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Producers;