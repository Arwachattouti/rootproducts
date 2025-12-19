import React, { useState } from 'react';
import { Clock, Users, ChefHat, Star, Play } from 'lucide-react';

const Recipes: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const recipes = [
    {
      id: '1',
      title: 'Mloukhia Traditionnelle au Poulet',
      category: 'traditional',
      difficulty: 'Facile',
      time: '45 min',
      servings: 4,
      rating: 4.8,
      image: 'https://images.pexels.com/photos/8844352/pexels-photo-8844352.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      description: 'La recette authentique tunisienne transmise de génération en génération.',
      ingredients: [
        '250g de mloukhia ROOT Products',
        '1 poulet fermier',
        '2 oignons',
        '4 gousses d\'ail',
        'Épices traditionnelles'
      ],
      steps: [
        'Faire revenir le poulet avec les oignons',
        'Ajouter l\'ail et les épices',
        'Incorporer la mloukhia progressivement',
        'Laisser mijoter 30 minutes',
        'Servir avec du riz blanc'
      ]
    },
    {
      id: '2',
      title: 'Mloukhia Végétarienne aux Légumes',
      category: 'vegetarian',
      difficulty: 'Facile',
      time: '30 min',
      servings: 4,
      rating: 4.6,
      image: 'https://images.pexels.com/photos/4198024/pexels-photo-4198024.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      description: 'Version moderne et saine de la mloukhia, riche en légumes de saison.',
      ingredients: [
        '200g de mloukhia bio ROOT Products',
        'Courgettes, carottes, pommes de terre',
        'Bouillon de légumes',
        'Huile d\'olive extra vierge',
        'Herbes fraîches'
      ],
      steps: [
        'Préparer tous les légumes',
        'Faire revenir dans l\'huile d\'olive',
        'Ajouter le bouillon et la mloukhia',
        'Cuire 20 minutes à feu doux',
        'Garnir d\'herbes fraîches'
      ]
    },
    {
      id: '3',
      title: 'Mloukhia Express en 15 Minutes',
      category: 'quick',
      difficulty: 'Très Facile',
      time: '15 min',
      servings: 2,
      rating: 4.4,
      image: 'https://images.pexels.com/photos/7937447/pexels-photo-7937447.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      description: 'Parfaite pour les repas rapides sans compromis sur le goût.',
      ingredients: [
        '150g de mloukhia premium ROOT Products',
        'Bouillon cube',
        'Ail en poudre',
        'Huile d\'olive',
        'Pain pita'
      ],
      steps: [
        'Faire chauffer le bouillon',
        'Incorporer la mloukhia en remuant',
        'Assaisonner selon le goût',
        'Servir immédiatement',
        'Accompagner de pain pita'
      ]
    }
  ];

  const categories = [
    { value: 'all', label: 'Toutes les recettes' },
    { value: 'traditional', label: 'Traditionnelles' },
    { value: 'vegetarian', label: 'Végétariennes' },
    { value: 'quick', label: 'Rapides' }
  ];

  const filteredRecipes = selectedCategory === 'all' 
    ? recipes 
    : recipes.filter(recipe => recipe.category === selectedCategory);

  const tips = [
    {
      title: 'Conservation Optimale',
      content: 'Conservez votre mloukhia ROOT Products dans un endroit sec et frais, à l\'abri de la lumière.'
    },
    {
      title: 'Préparation Parfaite',
      content: 'Pour une texture idéale, incorporez la mloukhia progressivement en remuant constamment.'
    },
    {
      title: 'Assaisonnement Authentique',
      content: 'L\'ail et la coriandre sont les épices essentielles pour un goût traditionnel.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">Recettes & Conseils</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Découvrez l'art de cuisiner la mloukhia avec nos recettes authentiques 
              et nos conseils d'experts
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-green-700 text-white'
                  : 'bg-white text-gray-700 hover:bg-green-50'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white rounded-full p-2">
                  <Play className="h-5 w-5 text-green-700" />
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{recipe.title}</h3>
                <p className="text-gray-600 mb-4">{recipe.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {recipe.time}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {recipe.servings} pers.
                    </div>
                    <div className="flex items-center">
                      <ChefHat className="h-4 w-4 mr-1" />
                      {recipe.difficulty}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm text-gray-600">{recipe.rating}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Ingrédients:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                      <li key={index}>• {ingredient}</li>
                    ))}
                    {recipe.ingredients.length > 3 && (
                      <li className="text-green-600">+ {recipe.ingredients.length - 3} autres...</li>
                    )}
                  </ul>
                </div>

                <button className="w-full bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                  Voir la recette complète
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Conseils d'Expert
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tips.map((tip, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="h-6 w-6 text-green-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600">{tip.content}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Recipes;