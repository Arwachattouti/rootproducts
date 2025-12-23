import React from 'react';
import { Shield, Eye, Lock, Users, Cookie, Mail } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique de Confidentialité</h1>

        <div className="bg-white rounded-lg shadow p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-600" />
              Introduction
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                ROOT Products SARL (ci-après "nous", "notre" ou "ROOT Products") s'engage à protéger 
                et respecter votre vie privée. Cette politique de confidentialité explique comment nous 
                collectons, utilisons et protégeons vos informations personnelles lorsque vous utilisez 
                notre site web rootproducts.tn.
              </p>
              <p>
                En utilisant notre site, vous acceptez la collecte et l'utilisation d'informations 
                conformément à cette politique.
              </p>
            </div>
          </section>

          {/* Data Collection */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Eye className="h-5 w-5 mr-2 text-green-600" />
              Informations que nous collectons
            </h2>
            <div className="text-gray-700 space-y-4">
              <h3 className="font-semibold">Informations personnelles</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Adresse de livraison et de facturation</li>
                <li>Informations de paiement (traitées de manière sécurisée)</li>
              </ul>

              <h3 className="font-semibold mt-6">Informations techniques</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Adresse IP</li>
                <li>Type de navigateur et version</li>
                <li>Système d'exploitation</li>
                <li>Pages visitées et temps passé sur le site</li>
                <li>Données de géolocalisation approximative</li>
              </ul>
            </div>
          </section>

          {/* Data Usage */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-green-600" />
              Comment nous utilisons vos informations
            </h2>
            <div className="text-gray-700">
              <p className="mb-4">Nous utilisons vos informations personnelles pour :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Traiter et expédier vos commandes</li>
                <li>Vous contacter concernant vos commandes</li>
                <li>Améliorer notre service client</li>
                <li>Personnaliser votre expérience sur notre site</li>
                <li>Vous envoyer des newsletters (avec votre consentement)</li>
                <li>Analyser l'utilisation de notre site pour l'améliorer</li>
                <li>Respecter nos obligations légales</li>
                <li>Prévenir la fraude et assurer la sécurité</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Cookie className="h-5 w-5 mr-2 text-green-600" />
              Cookies et technologies similaires
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Notre site utilise des cookies pour améliorer votre expérience de navigation. 
                Les cookies sont de petits fichiers texte stockés sur votre appareil.
              </p>
              
              <h3 className="font-semibold">Types de cookies utilisés :</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site</li>
                <li><strong>Cookies de performance :</strong> Nous aident à comprendre comment vous utilisez notre site</li>
                <li><strong>Cookies de fonctionnalité :</strong> Mémorisent vos préférences</li>
                <li><strong>Cookies marketing :</strong> Utilisés pour vous proposer des publicités pertinentes</li>
              </ul>

              <p>
                Vous pouvez contrôler et/ou supprimer les cookies comme vous le souhaitez via les 
                paramètres de votre navigateur.
              </p>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Partage de vos informations</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers. 
                Nous pouvons partager vos informations dans les cas suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Avec nos prestataires de services (livraison, paiement) pour traiter vos commandes</li>
                <li>Si requis par la loi ou par une autorité judiciaire</li>
                <li>Pour protéger nos droits, notre propriété ou notre sécurité</li>
                <li>En cas de fusion, acquisition ou vente d'actifs</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Lock className="h-5 w-5 mr-2 text-green-600" />
              Sécurité de vos données
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations 
                personnelles contre l'accès non autorisé, la modification, la divulgation ou la destruction.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Chiffrement SSL pour toutes les transmissions de données</li>
                <li>Accès restreint aux informations personnelles</li>
                <li>Surveillance régulière de nos systèmes</li>
                <li>Formation de notre personnel sur la protection des données</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Vos droits</h2>
            <div className="text-gray-700 space-y-4">
              <p>Vous disposez des droits suivants concernant vos données personnelles :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données personnelles</li>
                <li><strong>Droit de rectification :</strong> Corriger des données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données</li>
                <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré</li>
                <li><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données</li>
                <li><strong>Droit de limitation :</strong> Limiter le traitement de vos données</li>
              </ul>
              <p>
                Pour exercer ces droits, contactez-nous à l'adresse : 
                <a href="mailto:privacy@rootproducts.tn" className="text-green-600 hover:text-green-700 ml-1">
                  privacy@rootproducts.tn
                </a>
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Conservation des données</h2>
            <div className="text-gray-700 space-y-4">
              <p>Nous conservons vos données personnelles pendant les durées suivantes :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Données de compte : Tant que votre compte est actif</li>
                <li>Données de commande : 10 ans pour les obligations comptables</li>
                <li>Données marketing : Jusqu'à votre désinscription</li>
                <li>Données techniques : 13 mois maximum</li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-green-600" />
              Nous contacter
            </h2>
            <div className="text-gray-700">
              <p className="mb-4">
                Pour toute question concernant cette politique de confidentialité ou vos données personnelles, 
                vous pouvez nous contacter :
              </p>
              <ul className="space-y-2">
                <li><strong>Email :</strong> privacy@rootproducts.tn</li>
                <li><strong>Adresse :</strong> ROOT Products SARL, Avenue Habib Bourguiba, 1000 Tunis, Tunisie</li>
                <li><strong>Téléphone :</strong> +216 71 XXX XXX</li>
              </ul>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Modifications de cette politique</h2>
            <div className="text-gray-700">
              <p>
                Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. 
                Nous vous informerons de tout changement en publiant la nouvelle politique sur cette page 
                et en mettant à jour la date de "dernière modification".
              </p>
            </div>
          </section>

          {/* Last Update */}
          <section className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">
              Dernière mise à jour : 15 janvier 2025
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;