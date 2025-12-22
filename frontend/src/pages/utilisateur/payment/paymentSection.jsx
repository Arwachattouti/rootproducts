import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/checkbox";
import { 
  ShieldCheck, CreditCard, Lock, ArrowLeft, Tag, Check, 
  Loader, X, Book, Package, Users, Clock, Award, PlayCircle 
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { SubscriptionService } from "shared/services/subscription.service";
import { CourseService } from "shared/services/course.service";
import { paymeeService } from "shared/services/api/paymee.service";
import { PaymentService } from "shared/services/payment.service";

const PaymentSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [applyingPromo, setApplyingPromo] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // State for course-specific data
  const [courseStats, setCourseStats] = useState({
    totalLessons: 0,
    formattedDuration: '0h',
    isLoading: true
  });

  const { 
    packId, 
    packName, 
    price, 
    billingPeriod, 
    features = [], 
    isPopular,
    promoCodes = [],
    courseId,
    courseData,
    coursePrice,
    itemType = location.state?.itemType || (courseId || courseData ? 'course' : 'pack')
  } = location.state || {};

  // Determine item type
  const isCourse = itemType === 'course';
  const isPack = itemType === 'pack' || (!isCourse && packId);

  useEffect(() => {
    const initializeItem = async () => {
      if (!packId && !courseId && !courseData) {
        setError("Aucun élément sélectionné");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (isPack) {
          // Handle pack initialization
          if (packName && price !== undefined) {
            const directSubscription = {
              id: packId,
              packName,
              price,
              billingPeriod,
              features,
              isPopular,
              promoCodes,
              type: 'pack'
            };
            setItem(directSubscription);
          } else {
            const result = await SubscriptionService.getSubscriptionById(packId);
            if (result.success) {
              setItem({
                ...result.data,
                type: 'pack'
              });
            } else {
              setError(result.error || "Erreur lors du chargement de l'abonnement");
            }
          }
        } else if (isCourse) {
          // Handle course initialization
          if (courseData) {
            const formattedCourse = {
              ...courseData,
              id: courseId || courseData.id,
              name: courseData.titre,
              description: courseData.description,
              price: coursePrice || courseData.prix || 0,
              isFree: courseData.prix === 0 || courseData.estGratuit === true,
              promotion: courseData.promotion || null,
              features: courseData.features || [],
              category: courseData.categorieName,
              instructor: courseData.auteur,
              niveau: courseData.niveau,
              langue: courseData.langue,
              dateMiseAJour: courseData.dateMiseAJour,
              type: 'course'
            };
            setItem(formattedCourse);
            fetchCourseStats(courseId || courseData.id);
          } else if (courseId) {
            const result = await CourseService.getCourseById(courseId);
            if (result.success) {
              const courseData = result.data;
              const formattedCourse = {
                ...courseData,
                id: courseId,
                name: courseData.titre,
                description: courseData.description,
                price: courseData.prix || 0,
                isFree: courseData.prix === 0 || courseData.estGratuit === true,
                promotion: courseData.promotion || null,
                features: courseData.features || [],
                category: courseData.categorieName,
                instructor: courseData.auteur,
                niveau: courseData.niveau,
                langue: courseData.langue,
                dateMiseAJour: courseData.dateMiseAJour,
                type: 'course'
              };
              setItem(formattedCourse);
              fetchCourseStats(courseId);
            } else {
              setError(result.error || "Erreur lors du chargement du cours");
            }
          }
        }
      } catch (err) {
        setError("Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };

    const fetchCourseStats = async (courseId) => {
      try {
        const chaptersResult = await CourseService.getCourseChapters(courseId);
        if (chaptersResult.success && chaptersResult.data?.length > 0) {
          let totalLessons = 0;
          let totalDurationMinutes = 0;

          const lessonPromises = chaptersResult.data.map(chapter =>
            CourseService.getChapterLessons(courseId, chapter.id)
          );

          const lessonsResults = await Promise.allSettled(lessonPromises);
          lessonsResults.forEach((result) => {
            if (result.status === 'fulfilled' && result.value.success && result.value.data) {
              const chapterLessons = result.value.data;
              totalLessons += chapterLessons.length;
              totalDurationMinutes += chapterLessons.reduce((sum, lesson) =>
                sum + (Number(lesson.duree) || 0), 0
              );
            }
          });

          const formatDuration = (totalMinutes) => {
            if (!totalMinutes || totalMinutes === 0) return '0h';
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            if (hours === 0) return `${minutes}min`;
            if (minutes === 0) return `${hours}h`;
            return `${hours}h${minutes.toString().padStart(2, '0')}`;
          };

          setCourseStats({
            totalLessons,
            formattedDuration: formatDuration(totalDurationMinutes),
            isLoading: false
          });
        } else {
          setCourseStats({
            totalLessons: 0,
            formattedDuration: '0h',
            isLoading: false
          });
        }
      } catch (error) {
        setCourseStats({
          totalLessons: 0,
          formattedDuration: '0h',
          isLoading: false
        });
      }
    };

    initializeItem();
  }, [packId, courseId, courseData, isPack, isCourse]);

  const calculatePriceWithPromotion = (item) => {
    if (!item) return 0;
    
    if (item.type === 'pack') {
      return parseFloat(item.price) || 0;
    } else if (item.type === 'course') {
      const basePrice = item.price || 0;
      
      // Check if there's an active promotion
      if (item.promotion?.actif) {
        const now = new Date();
        const promoStart = item.promotion.dateDebut ? new Date(item.promotion.dateDebut) : null;
        const promoEnd = item.promotion.dateFin ? new Date(item.promotion.dateFin) : null;
        
        const isPromoActive = (!promoStart || now >= promoStart) && 
                              (!promoEnd || now <= promoEnd);
        
        if (isPromoActive && item.promotion.pourcentage) {
          const discount = (basePrice * item.promotion.pourcentage) / 100;
          const finalPrice = Math.max(0, basePrice - discount);
          return finalPrice;
        }
      }
      
      return basePrice;
    }
    
    return 0;
  };

  const validatePromoCode = async () => {
    if (!item || !promoCode.trim()) {
      setPromoError("Veuillez entrer un code promo");
      return;
    }

    setApplyingPromo(true);
    setPromoError("");

    try {
      let promo;
      
      if (item.type === 'pack') {
        // Validate pack promo code
        const localPromo = item.promoCodes?.find(p => 
          p.code === promoCode.toUpperCase() && p.isActive
        );

        if (localPromo) {
          promo = localPromo;
        } else {
          const validationResult = await SubscriptionService.validatePromoCode(item.id, promoCode);
          if (validationResult.success && validationResult.isValid) {
            const applyResult = await SubscriptionService.applyPromoCode(item.id, promoCode);
            if (applyResult.success) {
              promo = applyResult.data;
            }
          }
        }
      } else if (item.type === 'course') {
        // Validate course promo code
        const validationResult = await CourseService.validateCoursePromoCode(item.id, promoCode);
        if (validationResult.success && validationResult.isValid) {
          promo = validationResult;
        }
      }

      if (promo) {
        const originalPrice = calculatePriceWithPromotion(item);
        const discountAmountValue = (originalPrice * promo.discount) / 100;
        const finalPrice = Math.max(0, originalPrice - discountAmountValue);

        const promoResult = {
          code: promo.code,
          discount: promo.discount,
          discountAmount: discountAmountValue,
          originalPrice: originalPrice,
          finalPrice: finalPrice,
          validUntil: promo.validUntil
        };

        setAppliedPromo(promoResult);
        setDiscountAmount(discountAmountValue);
        setPromoError("");
      } else {
        setPromoError("Code promo invalide ou expiré");
        setAppliedPromo(null);
        setDiscountAmount(0);
      }
    } catch (err) {
      setPromoError("Erreur lors de la validation du code promo");
      setAppliedPromo(null);
      setDiscountAmount(0);
    } finally {
      setApplyingPromo(false);
    }
  };

  const removePromoCode = () => {
    setPromoCode("");
    setAppliedPromo(null);
    setDiscountAmount(0);
    setPromoError("");
  };

  const validateForm = () => {
    const errors = [];

    if (!firstName.trim()) errors.push("Le prénom est requis");
    if (!lastName.trim()) errors.push("Le nom est requis");
    if (!email.trim()) errors.push("L'email est requis");
    if (!phone.trim()) errors.push("Le téléphone est requis");
    if (!address.trim()) errors.push("L'adresse est requise");
    if (!city.trim()) errors.push("La ville est requise");
    if (!postalCode.trim()) errors.push("Le code postal est requis");
    if (!acceptTerms) errors.push("Vous devez accepter les conditions générales");

    return errors;
  };

  const handlePayment = async () => {
    setError(null);
    setPromoError(null);

    const formErrors = validateForm();
    if (formErrors.length > 0) {
        setError(formErrors.join(", "));
        return;
    }

    if (!item) {
        setError("Aucun élément sélectionné");
        return;
    }

    if (item.type === 'course' && item.isFree) {
        setError("Ce cours est gratuit. Veuillez vous inscrire directement.");
        return;
    }

    if (!acceptTerms) {
        setError("Vous devez accepter les conditions générales");
        return;
    }

    setLoading(true);

    try {
        const basePrice = calculatePriceWithPromotion(item);
        const finalAmount = appliedPromo ? appliedPromo.finalPrice : basePrice;
        const orderId = `${item.type}_order_${Date.now()}_${item.id}`;
        
        const paymentSessionData = {
            itemType: item.type,
            [item.type]: item.type === 'pack' ? {
                id: item.id,
                packName: item.packName,
                price: item.price,
                billingPeriod: item.billingPeriod,
                features: item.features
            } : {
                id: item.id,
                name: item.name,
                description: item.description,
                originalPrice: item.price,
                finalPrice: finalAmount,
                instructor: item.instructor,
                category: item.category
            },
            customer: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                address: address,
                city: city,
                postalCode: postalCode
            },
            promotion: item.type === 'course' && item.promotion?.actif ? {
                percentage: item.promotion.pourcentage,
                reason: item.promotion.motif,
                validUntil: item.promotion.dateFin
            } : null,
            promo: appliedPromo ? {
                code: appliedPromo.code,
                discount: appliedPromo.discount,
                discountAmount: appliedPromo.discountAmount,
                finalPrice: finalAmount
            } : null,
            timestamp: new Date().toISOString()
        };

        sessionStorage.setItem(`${item.type}PaymentSessionData`, JSON.stringify(paymentSessionData));

        const paymeeTransactionData = {
            amount: finalAmount,
            note: item.type === 'pack' ? `Abonnement ${item.packName}` : `Cours: ${item.name}`,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
            order_id: orderId
        };

        const paymeeValidation = paymeeService.validatePaymentData(paymeeTransactionData);
        if (!paymeeValidation.isValid) {
            const errorMessage = Array.isArray(paymeeValidation.errors) 
                ? paymeeValidation.errors.join(", ") 
                : "Erreur de validation des données";
            setError(errorMessage);
            setLoading(false);
            return;
        }

        const paymeeResult = await paymeeService.createPayment(paymeeTransactionData);

        if (!paymeeResult.success) {
            setError(`Erreur lors de la création du paiement: ${paymeeResult.error}`);
            setLoading(false);
            return;
        }

        if (!paymeeResult.data.payment_url) {
            setError("URL de paiement manquante. Veuillez réessayer.");
            setLoading(false);
            return;
        }

        const transactionData = {
            orderId: orderId,
            amount: finalAmount,
            currency: 'TND',
            note: item.type === 'pack' ? `Abonnement ${item.packName}` : `Cours: ${item.name}`,
            customer: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone
            },
            webhookUrl: `${window.location.origin}/api/payments/webhook/paymee`,
            status: 'pending', 
            paymentMethod: 'paymee',
            paymeeToken: paymeeResult.data.token,
            paymentUrl: paymeeResult.data.payment_url,
            redirectUrl: `${window.location.origin}/payment/return/${item.type}`,
            metadata: {
                itemType: item.type,
                [item.type === 'pack' ? 'subscriptionId' : 'courseId']: item.id,
                [item.type === 'pack' ? 'subscriptionName' : 'courseName']: item.type === 'pack' ? item.packName : item.name,
                originalPrice: item.price,
                finalAmount: finalAmount,
                promotion: item.type === 'course' ? item.promotion : null,
                promoCode: appliedPromo?.code || null,
                discountAmount: appliedPromo?.discountAmount || 0,
                billingAddress: {
                    address: address,
                    city: city,
                    postalCode: postalCode
                }
            }
        };

        const paymentResult = await PaymentService.createPayment(transactionData);

        if (paymentResult.success) {
            if (paymentResult.data?.id) {
                sessionStorage.setItem(`${item.type}TransactionId`, paymentResult.data.id);
                sessionStorage.setItem(`${item.type}PaymeeOrderId`, orderId);
                sessionStorage.setItem(`${item.type}PaymeePaymentToken`, paymeeResult.data.token);
            }
        }

        setError("Redirection vers la plateforme de paiement sécurisée...");
        
        setTimeout(() => {
            window.location.href = paymeeResult.data.payment_url;
        }, 2000);

    } catch (err) {
        const errorMessage = err.message 
            ? `Erreur: ${err.message}` 
            : "Une erreur inattendue s'est produite lors du traitement du paiement";
        
        setError(errorMessage);
        setLoading(false);
    }
  };

  const calculateFinalPrice = () => {
    if (!item) return 0;
    
    let price = calculatePriceWithPromotion(item);
    
    if (appliedPromo) {
      price = appliedPromo.finalPrice;
    }
    
    return price;
  };

  const finalPrice = calculateFinalPrice();
  const originalPrice = item ? calculatePriceWithPromotion(item) : 0;
  const hasActivePromotion = item?.type === 'course' && item.promotion?.actif;

  const getBackUrl = () => {
    if (item?.type === 'pack') return "/";
    if (item?.type === 'course') return `/course/${item.id}`;
    return "/";
  };

  if (loading && !item) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Chargement...</h2>
          <p className="text-gray-600">
            {isCourse ? "Récupération des détails de votre cours" : "Récupération des détails de votre abonnement"}
          </p>
        </div>
      </div>
    );
  }

  if (item?.type === 'course' && item.isFree) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Cours Gratuit</h2>
          <p className="text-gray-600 mb-4">
            Ce cours est gratuit. Vous pouvez vous inscrire directement sans paiement.
          </p>
          <Button onClick={() => navigate(`/course/${item.id}`)}>
            Retour au cours
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(getBackUrl())}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {item?.type === 'pack' ? 'Retour aux plans' : 'Retour au cours'}
          </Button>
        </div>
      </div>

      <div className="flex justify-center py-10 px-6">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                Informations de facturation
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="firstName" className="mb-2 block font-bold">Prénom *</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Votre prénom" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="mb-2 block font-bold">Nom *</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Votre nom" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="email" className="mb-2 block font-bold">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="exemple@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="phone" className="mb-2 block font-bold">Téléphone *</Label>
                <Input 
                  id="phone" 
                  placeholder="+216 XX XXX XXX" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="address" className="mb-2 block font-bold">Adresse *</Label>
                <Input 
                  id="address" 
                  placeholder="Rue, numéro..." 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="city" className="mb-2 block font-bold">Ville *</Label>
                  <Input 
                    id="city" 
                    placeholder="Votre ville" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode" className="mb-2 block font-bold">Code postal *</Label>
                  <Input 
                    id="postalCode" 
                    placeholder="0000" 
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mode de paiement
              </h3>

              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <span className="text-gray-800 font-medium">
                    Carte bancaire
                  </span>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                    alt="Visa"
                    className="w-10 ml-auto"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg"
                    alt="Mastercard"
                    className="w-10"
                  />
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-lg opacity-60 cursor-not-allowed">
                  <input type="radio" name="payment" disabled />
                  <span className="text-gray-800 font-medium">PayPal</span>
                  <span className="ml-auto text-sm text-gray-500">
                    Bientôt
                  </span>
                </label>
              </div>

              {paymentMethod === "card" && (
                <>
                  <div className="mb-4">
                    <Label className="mb-2 block font-bold">Nom sur la carte</Label>
                    <Input placeholder="Votre nom complet" />
                  </div>

                  <div className="mb-4">
                    <Label className="mb-2 block font-bold">Numéro de carte</Label>
                    <Input placeholder="1234 5678 9012 3456" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="mb-2 block font-bold">Expiration</Label>
                      <Input placeholder="MM/AA" />
                    </div>
                    <div>
                      <Label className="mb-2 block font-bold">CVC</Label>
                      <Input placeholder="123" />
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-start gap-2 mb-4">
                <Checkbox
                  checked={acceptTerms}
                  onCheckedChange={setAcceptTerms}
                  id="terms"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-gray-600 leading-relaxed font-semibold"
                >
                  J'accepte les{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    conditions générales d'utilisation
                  </a>{" "}
                  et la{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    politique de confidentialité
                  </a>
                </Label>
              </div>

              <Button
                disabled={!acceptTerms || loading}
                className="w-full mt-4 font-semibold"
                onClick={handlePayment}
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payer {finalPrice.toFixed(2)} TND
                  </>
                )}
              </Button>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">Erreur</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              )}

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700 text-sm font-medium">Information</p>
                <p className="text-yellow-600 text-sm mt-1">
                  Après confirmation, vous serez redirigé vers la plateforme sécurisée de Paymee pour finaliser votre paiement.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start gap-3">
              <Lock className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="text-blue-700 font-semibold mb-1">
                  Paiement sécurisé
                </p>
                <p className="text-blue-600 text-sm leading-relaxed">
                  Vos informations sont protégées par un chiffrement SSL
                  256-bit. Nous ne stockons jamais vos données de carte
                  bancaire.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                {item?.type === 'pack' ? (
                  <Package className="w-6 h-6 text-blue-600" />
                ) : (
                  <Book className="w-6 h-6 text-green-600" />
                )}
                <h2 className="text-2xl font-semibold text-gray-900">
                  {item?.type === 'pack' ? 'Récapitulatif de l\'abonnement' : 'Récapitulatif du cours'}
                </h2>
              </div>

              {item && (
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.type === 'pack' ? item.packName : item.name}
                      </h3>
                      <p className="text-sm text-gray-500">ID: {item.id}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.type === 'pack' && item.isPopular && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Populaire
                          </span>
                        )}
                        
                        {item.type === 'course' && item.category && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {item.category}
                          </span>
                        )}
                        
                        {item.type === 'course' && item.instructor && (
                          <p className="text-sm text-gray-600">Formateur: {item.instructor}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex flex-col items-end">
                        {hasActivePromotion && (
                          <>
                            <p className="text-lg line-through text-gray-400">
                              {item.price?.toFixed(2)} TND
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                              {originalPrice.toFixed(2)} TND
                            </p>
                            <p className="text-sm text-green-600 font-medium">
                              {item.promotion.pourcentage}% de promotion
                            </p>
                          </>
                        )}
                        {!hasActivePromotion && !appliedPromo && (
                          <p className="text-2xl font-bold text-gray-900">
                            {originalPrice.toFixed(2)} TND
                          </p>
                        )}
                        {appliedPromo && (
                          <>
                            {hasActivePromotion && (
                              <p className="text-sm text-gray-400 line-through">
                                {originalPrice.toFixed(2)} TND
                              </p>
                            )}
                            <p className="text-2xl font-bold text-green-600">
                              {finalPrice.toFixed(2)} TND
                            </p>
                            <p className="text-sm text-green-600 font-medium">
                              {appliedPromo.discount}% code promo
                            </p>
                          </>
                        )}
                      </div>
                      
                      {item.type === 'pack' && (
                        <p className="text-sm text-gray-500 mt-1">
                          {item.billingPeriod === "monthly" ? "par mois" : 
                           item.billingPeriod === "yearly" ? "par an" : 
                           "une fois"}
                        </p>
                      )}
                    </div>
                  </div>

                  {item.description && (
                    <div className="mb-4">
                      <p className="text-gray-700 text-sm line-clamp-2">{item.description}</p>
                    </div>
                  )}

                  {/* Course-specific details */}
                  {item.type === 'course' && (
                    <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <PlayCircle className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {courseStats.isLoading ? (
                            <span className="inline-block h-3 w-12 bg-gray-200 rounded animate-pulse"></span>
                          ) : (
                            courseStats.formattedDuration
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {courseStats.isLoading ? (
                            <span className="inline-block h-3 w-8 bg-gray-200 rounded animate-pulse"></span>
                          ) : (
                            `${courseStats.totalLessons} leçons`
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {item.niveau ? item.niveau.charAt(0).toUpperCase() + item.niveau.slice(1) : 'Tous niveaux'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {item.langue === 'fr' ? 'Français' : 
                           item.langue === 'en' ? 'English' : 
                           item.langue === 'ar' ? 'العربية' : item.langue}
                        </span>
                      </div>
                    </div>
                  )}

                  {item.features && item.features.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {item.type === 'pack' ? 'Fonctionnalités incluses:' : 'Ce que vous allez apprendre:'}
                      </h4>
                      <ul className="space-y-2">
                        {item.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t pt-4">
                {hasActivePromotion && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Prix original</span>
                    <span className="text-gray-900 line-through">{item?.price?.toFixed(2) || '0.00'} TND</span>
                  </div>
                )}
                {hasActivePromotion && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-green-700">
                      Promotion ({item?.promotion?.pourcentage || 0}%)
                    </span>
                    <span className="text-green-700">
                      -{(item?.price - originalPrice).toFixed(2)} TND
                    </span>
                  </div>
                )}
                {appliedPromo && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-green-700">
                      Code promo ({appliedPromo.discount}%) - {appliedPromo.code}
                    </span>
                    <span className="text-green-700">-{discountAmount.toFixed(2)} TND</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-gray-700 font-medium">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {finalPrice.toFixed(2)} TND
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1 text-right">
                  {item?.type === 'pack' ? (
                    item.billingPeriod === "monthly" ? "Facturation mensuelle" : 
                    item.billingPeriod === "yearly" ? "Facturation annuelle" : 
                    "Paiement unique"
                  ) : (
                    "Accès à vie"
                  )}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <Label className="mb-1 flex items-center gap-2 text-gray-900 font-semibold">
                <Tag className="w-4 h-4 text-gray-700" />
                Code promo
              </Label>
              <div className="flex gap-2 mt-3">
                <Input 
                  placeholder="Entrez votre code" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={applyingPromo || appliedPromo}
                  className={appliedPromo ? "bg-green-50 border-green-200" : ""}
                  onKeyPress={(e) => e.key === 'Enter' && validatePromoCode()}
                />
                {appliedPromo ? (
                  <Button variant="outline" onClick={removePromoCode} className="text-red-600 border-red-200 hover:bg-red-50">
                    <X className="w-4 h-4 mr-1" />
                    Retirer
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={validatePromoCode}
                    disabled={applyingPromo || !promoCode.trim()}
                  >
                    {applyingPromo ? (
                      <Loader className="w-4 h-4 mr-1 animate-spin" />
                    ) : null}
                    Appliquer
                  </Button>
                )}
              </div>
              
              {appliedPromo && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-green-700 text-sm font-medium">
                    Code "{appliedPromo.code}" appliqué : {appliedPromo.discount}% de réduction
                  </p>
                  <p className="text-green-600 text-xs mt-1">
                    Économie de {discountAmount.toFixed(2)} TND
                  </p>
                </div>
              )}
              
              {promoError && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-700 text-sm">{promoError}</p>
                </div>
              )}
            </div>

            <div className="bg-green-50 border border-green-100 rounded-xl p-5 flex items-start gap-3">
              <ShieldCheck className="text-green-600 mt-1" size={20} />
              <div>
                <p className="text-green-700 font-medium">Garantie 30 jours</p>
                <p className="text-gray-600 text-sm">
                  Satisfait ou remboursé sans condition pendant 30 jours
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <p className="text-gray-700 font-medium mb-2">Une question ?</p>
              <p className="text-sm text-gray-600 mb-4">
                Notre équipe support est disponible pour vous aider
              </p>
              <Button onClick={() => navigate("/#contact")} variant="outline">
                Contacter le support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;