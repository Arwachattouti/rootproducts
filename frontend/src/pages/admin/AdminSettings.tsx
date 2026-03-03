import React, { useState } from 'react';
import {
  Save,
  Upload,
  Globe,
  Mail,
  Bell,
  Shield,
  Palette,
  Database,
  Truck,
  CreditCard,
  Settings as SettingsIcon,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'ROOT Products',
    siteDescription: 'Mloukhia authentique tunisienne',
    contactEmail: 'contact@rootproducts.tn',
    contactPhone: '+216 71 XXX XXX',
    address: 'Avenue Habib Bourguiba, 1000 Tunis, Tunisie',

    // Notifications
    emailNotifications: true,
    orderNotifications: true,
    stockAlerts: true,
    newsletterEnabled: true,

    // Shipping
    freeShippingThreshold: 25,
    standardShippingCost: 5,
    expressShippingCost: 10,

    // Payment
    acceptCreditCards: true,
    acceptPaypal: false,
    acceptBankTransfer: true,

    // SEO
    metaTitle: 'ROOT Products - Mloukhia Authentique Tunisienne',
    metaDescription:
      'Découvrez notre mloukhia premium, cultivée selon les traditions ancestrales tunisiennes.',
    metaKeywords: 'mloukhia, tunisie, bio, authentique, tradition',

    // Security
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: 'medium',
  });

  const tabs = [
    { id: 'general', name: 'Général', icon: SettingsIcon },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'shipping', name: 'Livraison', icon: Truck },
    { id: 'payment', name: 'Paiement', icon: CreditCard },
    { id: 'seo', name: 'SEO', icon: Globe },
    { id: 'security', name: 'Sécurité', icon: Shield },
  ];

  const activeTabData = tabs.find((t) => t.id === activeTab);

  const handleInputChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert('Paramètres sauvegardés avec succès !');
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  // Toggle switch component for reusability
  const ToggleSwitch = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
    </label>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Paramètres
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-0.5">
                Configurez votre boutique en ligne
              </p>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base transition-colors w-full sm:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Mobile Tab Selector (visible < lg) */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-between bg-white rounded-lg shadow px-4 py-3 text-left"
            >
              <div className="flex items-center">
                {activeTabData && (
                  <activeTabData.icon className="h-5 w-5 mr-3 text-green-600" />
                )}
                <span className="font-medium text-gray-900 text-sm sm:text-base">
                  {activeTabData?.name}
                </span>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                  mobileMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Mobile Dropdown */}
            {mobileMenuOpen && (
              <div className="mt-2 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left text-sm sm:text-base transition-colors ${
                      activeTab === tab.id
                        ? 'bg-green-50 text-green-700 border-l-4 border-green-600'
                        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Sidebar (visible >= lg) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 xl:p-6 sticky top-8">
              <nav className="space-y-1.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 xl:px-4 py-2.5 xl:py-3 text-left rounded-lg transition-colors text-sm xl:text-base ${
                      activeTab === tab.id
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 xl:h-5 xl:w-5 mr-2.5 xl:mr-3 shrink-0" />
                    <span className="truncate">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-4 sm:p-5 md:p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                    Paramètres Généraux
                  </h2>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Nom du site
                        </label>
                        <input
                          type="text"
                          value={settings.siteName}
                          onChange={(e) =>
                            handleInputChange('siteName', e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Email de contact
                        </label>
                        <input
                          type="email"
                          value={settings.contactEmail}
                          onChange={(e) =>
                            handleInputChange('contactEmail', e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Description du site
                      </label>
                      <textarea
                        rows={3}
                        value={settings.siteDescription}
                        onChange={(e) =>
                          handleInputChange('siteDescription', e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={settings.contactPhone}
                          onChange={(e) =>
                            handleInputChange('contactPhone', e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Logo du site
                        </label>
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-green-700 font-bold text-sm sm:text-base">
                              R
                            </span>
                          </div>
                          <button className="flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base transition-colors">
                            <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                            Changer
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        value={settings.address}
                        onChange={(e) =>
                          handleInputChange('address', e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                    Notifications
                  </h2>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                          Notifications par email
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                          Recevoir les notifications importantes par email
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={settings.emailNotifications}
                        onChange={(val) =>
                          handleInputChange('emailNotifications', val)
                        }
                      />
                    </div>

                    <div className="border-t border-gray-100"></div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                          Notifications de commandes
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                          Être notifié des nouvelles commandes
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={settings.orderNotifications}
                        onChange={(val) =>
                          handleInputChange('orderNotifications', val)
                        }
                      />
                    </div>

                    <div className="border-t border-gray-100"></div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                          Alertes de stock
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                          Être alerté quand les stocks sont bas
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={settings.stockAlerts}
                        onChange={(val) =>
                          handleInputChange('stockAlerts', val)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping */}
              {activeTab === 'shipping' && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                    Paramètres de Livraison
                  </h2>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Seuil livraison gratuite (€)
                        </label>
                        <input
                          type="number"
                          value={settings.freeShippingThreshold}
                          onChange={(e) =>
                            handleInputChange(
                              'freeShippingThreshold',
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Livraison standard (€)
                        </label>
                        <input
                          type="number"
                          value={settings.standardShippingCost}
                          onChange={(e) =>
                            handleInputChange(
                              'standardShippingCost',
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-2 md:col-span-1">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Livraison express (€)
                        </label>
                        <input
                          type="number"
                          value={settings.expressShippingCost}
                          onChange={(e) =>
                            handleInputChange(
                              'expressShippingCost',
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment */}
              {activeTab === 'payment' && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                    Méthodes de Paiement
                  </h2>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center min-w-0">
                        <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3 shrink-0" />
                        <div className="min-w-0">
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                            Cartes de crédit
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
                            Visa, MasterCard, American Express
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        checked={settings.acceptCreditCards}
                        onChange={(val) =>
                          handleInputChange('acceptCreditCards', val)
                        }
                      />
                    </div>

                    <div className="border-t border-gray-100"></div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center min-w-0">
                        <div className="h-4 w-4 sm:h-5 sm:w-5 bg-blue-500 rounded mr-2 sm:mr-3 shrink-0"></div>
                        <div className="min-w-0">
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                            PayPal
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            Paiement sécurisé via PayPal
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        checked={settings.acceptPaypal}
                        onChange={(val) =>
                          handleInputChange('acceptPaypal', val)
                        }
                      />
                    </div>

                    <div className="border-t border-gray-100"></div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center min-w-0">
                        <Database className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3 shrink-0" />
                        <div className="min-w-0">
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                            Virement bancaire
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            Paiement par virement
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        checked={settings.acceptBankTransfer}
                        onChange={(val) =>
                          handleInputChange('acceptBankTransfer', val)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SEO */}
              {activeTab === 'seo' && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                    Référencement SEO
                  </h2>
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Titre Meta
                      </label>
                      <input
                        type="text"
                        value={settings.metaTitle}
                        onChange={(e) =>
                          handleInputChange('metaTitle', e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                        Recommandé : 50-60 caractères
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Description Meta
                      </label>
                      <textarea
                        rows={3}
                        value={settings.metaDescription}
                        onChange={(e) =>
                          handleInputChange('metaDescription', e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                        Recommandé : 150-160 caractères
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Mots-clés
                      </label>
                      <input
                        type="text"
                        value={settings.metaKeywords}
                        onChange={(e) =>
                          handleInputChange('metaKeywords', e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                        Séparez les mots-clés par des virgules
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                    Sécurité
                  </h2>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                          Authentification à deux facteurs
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                          Sécurité renforcée pour les comptes admin
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={settings.twoFactorAuth}
                        onChange={(val) =>
                          handleInputChange('twoFactorAuth', val)
                        }
                      />
                    </div>

                    <div className="border-t border-gray-100"></div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Timeout de session (minutes)
                      </label>
                      <select
                        value={settings.sessionTimeout}
                        onChange={(e) =>
                          handleInputChange(
                            'sessionTimeout',
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 heure</option>
                        <option value={120}>2 heures</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Politique de mot de passe
                      </label>
                      <select
                        value={settings.passwordPolicy}
                        onChange={(e) =>
                          handleInputChange('passwordPolicy', e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                      >
                        <option value="low">Faible (6 caractères min)</option>
                        <option value="medium">
                          Moyenne (8 caractères, majuscules/minuscules)
                        </option>
                        <option value="high">
                          Forte (12 caractères, caractères spéciaux)
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;