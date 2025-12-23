import React from 'react';
import { Building, Mail, Phone, MapPin } from 'lucide-react';

const Legal: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions Légales</h1>

        <div className="bg-white rounded-lg shadow p-8 space-y-8">
          {/* Company Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2 text-green-600" />
              Informations sur l'entreprise
            </h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Dénomination sociale :</strong> ROOT Products SARL</p>
              <p><strong>Forme juridique :</strong> Société à Responsabilité Limitée</p>
              <p><strong>Capital social :</strong> 50 000 TND</p>
              <p><strong>Numéro d'immatriculation :</strong> 1234567890123</p>
              <p><strong>Registre du commerce :</strong> Tunis B 123456789</p>
              <p><strong>Code APE :</strong> 4729Z - Autres commerces de détail alimentaires</p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-green-600" />
              Coordonnées
            </h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span>Avenue Habib Bourguiba, 1000 Tunis, Tunisie</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <span>+216 71 XXX XXX</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <span>contact@rootproducts.tn</span>
              </div>
            </div>
          </section>

          {/* Director */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Directeur de la publication</h2>
            <p className="text-gray-700">Ahmed Benali, Gérant de ROOT Products SARL</p>
          </section>

          {/* Hosting */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Hébergement</h2>
            <div className="text-gray-700">
              <p><strong>Hébergeur :</strong> Netlify, Inc.</p>
              <p><strong>Adresse :</strong> 2325 3rd Street, Suite 296, San Francisco, CA 94107, USA</p>
              <p>
                <strong>Site web :</strong>{' '}
                <a
                  href="https://www.netlify.com"
                  className="text-green-600 hover:text-green-700"
                >
                  www.netlify.com
                </a>
              </p>

            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Propriété intellectuelle</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                L'ensemble de ce site relève de la législation tunisienne et internationale sur le droit d'auteur
                et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les
                documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
              <p>
                La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est
                formellement interdite sauf autorisation expresse du directeur de la publication.
              </p>
              <p>
                Les marques ROOT Products et tous les logos figurant sur le site sont des marques déposées.
                Toute reproduction totale ou partielle de ces marques sans autorisation préalable et écrite
                est prohibée.
              </p>
            </div>
          </section>

          {/* Liability */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsabilité</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Les informations contenues sur ce site sont aussi précises que possible et le site remis à jour
                à différentes périodes de l'année, mais peut toutefois contenir des inexactitudes ou des omissions.
              </p>
              <p>
                Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien
                vouloir le signaler par email, à l'adresse contact@rootproducts.tn, en décrivant le problème
                de la manière la plus précise possible.
              </p>
              <p>
                ROOT Products ne pourra être tenue responsable des dommages directs et indirects causés au
                matériel de l'utilisateur, lors de l'accès au site rootproducts.tn, et résultant soit de
                l'utilisation d'un matériel ne répondant pas aux spécifications indiquées, soit de l'apparition
                d'un bug ou d'une incompatibilité.
              </p>
            </div>
          </section>

          {/* Personal Data */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Données personnelles</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Conformément à la loi tunisienne sur la protection des données personnelles, vous disposez d'un
                droit d'accès, de rectification et de suppression des données vous concernant.
              </p>
              <p>
                Pour exercer ce droit, adressez-vous à : ROOT Products SARL, Avenue Habib Bourguiba,
                1000 Tunis, Tunisie, ou par email à contact@rootproducts.tn.
              </p>
              <p>
                Aucune information personnelle de l'utilisateur du site rootproducts.tn n'est publiée à
                l'insu de l'utilisateur, échangée, transférée, cédée ou vendue sur un support quelconque à
                des tiers.
              </p>
            </div>
          </section>

          {/* Applicable Law */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Droit applicable</h2>
            <p className="text-gray-700">
              Tout litige en relation avec l'utilisation du site rootproducts.tn est soumis au droit tunisien.
              Il est fait attribution exclusive de juridiction aux tribunaux compétents de Tunis.
            </p>
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

export default Legal;
