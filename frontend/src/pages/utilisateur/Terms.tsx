import React from 'react';
import { FileText, ShoppingCart, Truck, CreditCard, AlertTriangle, Scale } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Conditions Générales de Vente</h1>

        <div className="bg-white rounded-lg shadow p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              Préambule
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles 
                entre ROOT Products SARL, société à responsabilité limitée au capital de 50 000 TND, 
                immatriculée au registre du commerce de Tunis sous le numéro B 123456789, dont le siège 
                social est situé Avenue Habib Bourguiba, 1000 Tunis, Tunisie (ci-après "ROOT Products" 
                ou "le Vendeur") et toute personne physique ou morale souhaitant procéder à un achat 
                via le site internet rootproducts.tn (ci-après "l'Acheteur" ou "le Client").
              </p>
              <p>
                Toute commande implique l'acceptation sans réserve par l'Acheteur des présentes CGV.
              </p>
            </div>
          </section>

          {/* Products */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 1 - Produits</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                ROOT Products propose à la vente des produits à base de mloukhia (Corchorus olitorius) 
                sous différentes formes : poudre, feuilles séchées, mélanges d'épices et coffrets cadeaux.
              </p>
              <p>
                Les photographies et descriptifs des produits présentés sur le site sont aussi fidèles 
                que possible mais n'engagent pas le Vendeur. Les différences de couleur pouvant apparaître 
                sur les photographies résultent des paramètres d'affichage de l'écran utilisé.
              </p>
              <p>
                Tous nos produits sont conformes à la réglementation tunisienne et européenne en vigueur 
                concernant les denrées alimentaires.
              </p>
            </div>
          </section>

          {/* Orders */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2 text-green-600" />
              Article 2 - Commandes
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Les commandes peuvent être passées uniquement sur le site rootproducts.tn, 24h/24 et 7j/7.
              </p>
              <p>
                Pour passer commande, le Client doit obligatoirement :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Être âgé de 18 ans révolus ou disposer de l'autorisation parentale</li>
                <li>Remplir correctement le formulaire de commande</li>
                <li>Valider sa commande après vérification</li>
                <li>Effectuer le paiement selon les modalités proposées</li>
              </ul>
              <p>
                La vente ne sera considérée comme définitive qu'après encaissement effectif du prix 
                par ROOT Products et expédition des produits commandés.
              </p>
            </div>
          </section>

          {/* Prices */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 3 - Prix</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Les prix sont indiqués en dinars tunisiens (TND) toutes taxes comprises (TTC). 
                Ils sont valables au moment de la commande et peuvent être modifiés à tout moment.
              </p>
              <p>
                Les frais de livraison sont offerts pour toute commande supérieure à 25 TND en Tunisie. 
                Pour les commandes inférieures à ce montant, des frais de livraison de 5 TND s'appliquent.
              </p>
              <p>
                Pour les livraisons internationales, les frais de port sont calculés selon la destination 
                et le poids de la commande.
              </p>
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-green-600" />
              Article 4 - Paiement
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>Le paiement s'effectue au moment de la commande par :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Carte bancaire (Visa, MasterCard)</li>
                <li>Virement bancaire</li>
                <li>Paiement à la livraison (selon zones géographiques)</li>
              </ul>
              <p>
                Les données de paiement sont sécurisées et cryptées. ROOT Products ne conserve aucune 
                donnée bancaire après la transaction.
              </p>
              <p>
                En cas de refus d'autorisation de paiement par l'organisme bancaire, la commande sera 
                automatiquement annulée.
              </p>
            </div>
          </section>

          {/* Delivery */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-green-600" />
              Article 5 - Livraison
            </h2>
            <div className="text-gray-700 space-y-4">
              <h3 className="font-semibold">Zones de livraison</h3>
              <p>Nous livrons en Tunisie et dans certains pays du Maghreb et d'Europe.</p>

              <h3 className="font-semibold">Délais de livraison</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Tunisie : 2 à 5 jours ouvrés</li>
                <li>Maghreb : 5 à 10 jours ouvrés</li>
                <li>Europe : 7 à 15 jours ouvrés</li>
              </ul>

              <p>
                Les délais de livraison sont donnés à titre indicatif et peuvent varier selon la 
                disponibilité des produits et la zone de livraison.
              </p>

              <h3 className="font-semibold">Réception de la commande</h3>
              <p>
                Il appartient au Client de vérifier l'état de sa commande à la réception et de 
                signaler immédiatement au transporteur toute anomalie (colis endommagé, produits 
                manquants, etc.).
              </p>
            </div>
          </section>

          {/* Returns */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 6 - Droit de rétractation</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Conformément à la législation en vigueur, le Client dispose d'un délai de 14 jours 
                à compter de la réception de sa commande pour exercer son droit de rétractation, 
                sans avoir à justifier de motifs ni à payer de pénalités.
              </p>
              <p>
                Les produits doivent être retournés dans leur emballage d'origine, en parfait état, 
                accompagnés de tous les accessoires éventuels et de la facture d'achat.
              </p>
              <p>
                Les frais de retour sont à la charge du Client, sauf en cas de produit défectueux 
                ou d'erreur de notre part.
              </p>
              <p>
                Le remboursement sera effectué dans un délai maximum de 14 jours à compter de la 
                réception du produit retourné.
              </p>
            </div>
          </section>

          {/* Warranty */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 7 - Garanties</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                ROOT Products garantit que tous les produits vendus sont conformes aux normes 
                de qualité et de sécurité alimentaire en vigueur.
              </p>
              <p>
                En cas de produit défectueux ou non conforme, le Client peut demander :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Le remplacement du produit</li>
                <li>Le remboursement intégral</li>
                <li>Un avoir pour un achat ultérieur</li>
              </ul>
              <p>
                Cette garantie ne couvre pas les dommages résultant d'une mauvaise utilisation, 
                d'une conservation inadéquate ou de l'usure normale du produit.
              </p>
            </div>
          </section>

          {/* Liability */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-green-600" />
              Article 8 - Responsabilité
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                ROOT Products ne saurait être tenue responsable de l'inexécution du contrat conclu 
                en cas de rupture de stock ou d'indisponibilité du produit, de force majeure, de 
                perturbation ou grève totale ou partielle des services postaux et moyens de transport 
                et/ou communications.
              </p>
              <p>
                La responsabilité de ROOT Products ne peut être engagée en cas de dommages indirects 
                ou immatériels.
              </p>
            </div>
          </section>

          {/* Personal Data */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 9 - Données personnelles</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Les informations personnelles recueillies lors de la commande sont nécessaires au 
                traitement de celle-ci. Elles sont destinées à ROOT Products et à ses partenaires 
                chargés de l'exécution des services.
              </p>
              <p>
                Conformément à la loi sur la protection des données personnelles, le Client dispose 
                d'un droit d'accès, de rectification et de suppression des données le concernant.
              </p>
              <p>
                Pour plus d'informations, consultez notre 
                <a href="/privacy" className="text-green-600 hover:text-green-700 ml-1">
                  Politique de Confidentialité
                </a>.
              </p>
            </div>
          </section>

          {/* Applicable Law */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Scale className="h-5 w-5 mr-2 text-green-600" />
              Article 10 - Droit applicable et juridiction
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Les présentes CGV sont soumises au droit tunisien. En cas de litige, et après 
                recherche d'une solution amiable, les tribunaux de Tunis seront seuls compétents.
              </p>
              <p>
                Pour toute réclamation, le Client peut s'adresser au service client de ROOT Products :
              </p>
              <ul className="space-y-1 ml-4">
                <li>Email : contact@rootproducts.tn</li>
                <li>Téléphone : +216 71 XXX XXX</li>
                <li>Adresse : Avenue Habib Bourguiba, 1000 Tunis, Tunisie</li>
              </ul>
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

export default Terms;