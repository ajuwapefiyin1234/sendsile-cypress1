import { DashboardWidth } from '../../../components/global/dashboard-width';
import { ramadanDonationbg, clockIcon } from '../../../assets/images';
import { useEffect, useState } from 'react';
import { BiHeart } from 'react-icons/bi';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { axiosInstance, axiosPrivate } from '../../../services/axios';

const PRESET_AMOUNTS = [
  { label: '₦5,000', value: 5000 },
  { label: '₦10,000', value: 10000 },
  { label: '₦25,000', value: 25000 },
  { label: '₦50,000', value: 50000 },
  { label: '₦100,000', value: 100000 },
];

const donationSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
    email: z.string().email('Please enter a valid email address'),
    amount: z.number().min(5000, 'Minimum donation is ₦5000'),
    anonymous: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    // If not anonymous, name and email are required
    if (!data.anonymous) {
      if (!data.name || data.name.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Name must be at least 2 characters',
          path: ['name'],
        });
      }
      if (data.name && data.name.length > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Name is too long',
          path: ['name'],
        });
      }
      if (!data.email || !z.string().email().safeParse(data.email).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter a valid email address',
          path: ['email'],
        });
      }
    }
  });

type DonationFormData = z.infer<typeof donationSchema>;

const Donations = () => {
  const [donationAmount, setDonationAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof DonationFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetPercentage, setTargetPercentage] = useState(0);
  const [targetAmount, setTargetAmount] = useState(0);
  const [acquiredAmount, setAcquiredAmount] = useState(0);
  const [title, setTitle] = useState('');

  // Animation states
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [animateAcquiredAmount, setAnimatedAmountAcquired] = useState(0);
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    async function getDonationStat() {
      setLoading(true);
      try {
        const res = await axiosPrivate.get('/donations/statistics');
        if (res.status === 200) {
          const response = res?.data?.data;
          setTargetPercentage(response.percentage_achieved);
          setTargetAmount(response.target_amount_raw);
          setAcquiredAmount(response.amount_raised_raw);
          setTitle(response.campaign_title);
        } else throw new Error();
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    getDonationStat();
  }, []);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setAnimatedPercentage(Math.round(targetPercentage * easeOutQuart));
      setAnimatedAmountAcquired(Math.round(acquiredAmount * easeOutQuart));
      setAnimatedWidth(acquiredAmount * easeOutQuart);

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedPercentage(targetPercentage);
        setAnimatedAmountAcquired(acquiredAmount);
        setAnimatedWidth(acquiredAmount);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkFormValidity = () => {
      try {
        // Extract numeric amount
        const numericAmount = customAmount
          ? parseFloat(customAmount)
          : PRESET_AMOUNTS.find((p) => p.label === donationAmount)?.value || 0;

        const formData: DonationFormData = {
          name,
          email,
          amount: numericAmount,
          anonymous,
        };

        donationSchema.parse(formData);
        setIsFormValid(true);
      } catch (error) {
        setIsFormValid(false);
      }
    };

    checkFormValidity();
  }, [name, email, donationAmount, customAmount, anonymous]);

  const handlePresetAmount = (preset: (typeof PRESET_AMOUNTS)[0]) => {
    setDonationAmount(preset.label);
    setCustomAmount(preset.value.toString());
    setErrors((prev) => ({ ...prev, amount: undefined }));
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    setDonationAmount(value ? `₦${value}` : '');
    setErrors((prev) => ({ ...prev, amount: undefined }));
  };

  const validateForm = (): boolean => {
    try {
      // Extract numeric amount
      const numericAmount = customAmount
        ? parseFloat(customAmount)
        : PRESET_AMOUNTS.find((p) => p.label === donationAmount)?.value || 0;

      const formData: DonationFormData = {
        name,
        email,
        amount: numericAmount,
        anonymous,
      };

      donationSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Partial<Record<keyof DonationFormData, string>> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof DonationFormData;
          formattedErrors[path] = err.message;
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axiosInstance.post('/donations', {
        donor_name: name,
        donor_email: email,
        amount: customAmount,
        is_anonymous: anonymous,
      });

      if (res.data.status) {
        const { payment_link, donation_id } = res.data.data;
        localStorage.setItem('donation_id', donation_id);
        window.location.href = payment_link;
      }

      setDonationAmount('');
      setCustomAmount('');
      setName('');
      setEmail('');
      setAnonymous(false);
      setErrors({});
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardWidth>
      <section className="px-4 sm:px-10 xl:px-0 w-full xl:w-[1020px] 2xl:w-[1120px] mx-auto xl:py-[20px] pt-[160px]  ">
        <div className="w-full relative flex items-center justify-start rounded-lg overflow-hidden min-h-[180px] sm:min-h-[208px]">
          <img
            src={ramadanDonationbg}
            alt="ramadan"
            className="absolute inset-0 w-full h-full object-cover -z-20"
          />
          <div
            className="absolute inset-0 -z-20"
            style={{
              backgroundImage:
                'linear-gradient(180deg, hsla(46, 94%, 49%, 1) 0%, hsla(37, 94%, 46%, 1) 80%, hsla(37, 97%, 37%, 1) 100%, hsla(248, 87%, 36%, 1) 100%)',
              opacity: 0.9,
            }}
          />

          <div className="relative z-20 flex items-center h-full py-6 sm:py-8 px-4 sm:px-6 md:px-8">
            <div className="max-w-[550px]">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-white">
                Ramadan Mubarak!
              </h1>
              <p className="text-white/95 text-sm sm:text-base leading-relaxed">
                Join us in spreading blessings this holy month. Your generosity provides iftar meals
                to families in need.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 py-6 justif-stretch">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Donation Form Card */}
            <div className="p-8 bg-[#FFFFFF] border border-[#F3F4F6] rounded-2xl shadow-sm">
              <div className="flex items-center justify-between w-full mb-7">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{title}</h2>
                  <p className="text-[#6B7280]">Help us feed families this blessed month</p>
                </div>

                <div className="p-3 bg-[#F0FDFA] rounded-full">
                  <BiHeart className="h-[20px] w-[20px] text-[#2D7A6E]" />
                </div>
              </div>

              {/* Total Amount */}
              <div className="mb-7 h-[100px] flex flex-col justify-between ">
                <div className="flex w-full items-center justify-between">
                  <h3 className="text-4xl font-bold ">₦{animateAcquiredAmount.toLocaleString()}</h3>
                  <p className="text-[15px] text-[#6B7280]">
                    of <span className="text-black">₦</span>
                    {targetAmount} goal
                  </p>
                </div>

                <div className="w-full bg-[#F3F4F6] rounded-full h-[12px]">
                  <div
                    className="bg-[#FFA900] h-[12px] rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${animatedWidth}%` }}
                  ></div>
                </div>

                <div className="flex w-full items-center justify-between ">
                  <p className="text-[#FFA900] font-bold text-[15px] leading-5">
                    {animatedPercentage}% raised
                  </p>
                  <div className="flex gap-6 items-center ">
                    <div className="flex gap-6 items-center ">
                      <div className="flex gap-2 items-center ">
                        <img
                          src={clockIcon}
                          alt="Clock"
                          className="h-[18px] w-[18px] text-[#111827]"
                        />
                        <p className="font-bold text-[#111827] text-[15px]">30</p>
                      </div>
                      <p className="text-[15px] text-[#6B7280]"> days left</p>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-7">
                  <h3 className="font-bold text-[#111827] text-[20px] leading-7">
                    Make a Donation
                  </h3>
                  <p className="text-[15px] leading-5 text-[#6B7280] mb-4">Select amount</p>
                  <div className="grid grid-cols-5 gap-3 mb-4">
                    {PRESET_AMOUNTS.map((preset) => (
                      <button
                        type="button"
                        key={preset.value}
                        onClick={() => handlePresetAmount(preset)}
                        className={`py-3 px-4 rounded-lg  transition text-[15px]  ${
                          donationAmount === preset.label
                            ? 'text-[#0D1415] bg-[#FFFAF3] border border-[#FFA900]'
                            : 'bg-inherit text-[#374151] hover:bg-[#FFFAF3] hover:border-[#FFA900] border border-[#F0FDFA]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount Input */}
                  <div className="mb-4">
                    <input
                      type="number"
                      placeholder="₦ Enter amount"
                      value={customAmount}
                      className={`pl-4 border-[#E5E7EB] py-2 outline-none text-gray-500 border bg-[#FFFFFF] rounded-lg w-full ${
                        errors.amount ? 'border-red-500' : ''
                      }`}
                      onChange={handleCustomAmountChange}
                    />
                    {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                  </div>

                  {/* Form Inputs */}
                  <div className="space-y-4 mb-4">
                    <div>
                      <label className="block text-[#374151] text-[15px] font-medium mb-2">
                        Your name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setErrors((prev) => ({ ...prev, name: undefined }));
                        }}
                        className={`pl-4 border-[#E5E7EB] py-2 outline-none text-gray-500 border bg-[#FFFFFF] rounded-lg w-full ${
                          errors.name ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-[#374151] text-[15px] font-medium mb-2">
                        Email address
                      </label>
                      <input
                        type="email"
                        placeholder="Enter email address"
                        className={`pl-4 border-[#E5E7EB] py-2 outline-none text-[#374151] border bg-[#FFFFFF] rounded-lg w-full ${
                          errors.email ? 'border-red-500' : ''
                        }`}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Checkbox */}
                  <div className="mb-4 flex items-center">
                    <input
                      type="checkbox"
                      id="notify"
                      checked={anonymous}
                      onChange={(e) => setAnonymous(e.target.checked)}
                      className="w-4 h-4 rounded-full"
                    />
                    <label htmlFor="notify" className="ml-2 text-sm text-[#374151]">
                      Donate anonymously
                    </label>
                  </div>

                  {/* Donate Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className="w-full bg-gray-900 rounded-full mt-1 hover:bg-gray-800 text-white py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    {isSubmitting || loading ? 'Processing...' : `Donate ${donationAmount || '₦0'}`}
                  </button>
                </div>
              </form>

              {/* Link text */}
              <p className="text-center  text-sm text-[#6B7280]">
                100% of your donation goes to feeding families in need
              </p>
            </div>
          </div>
        </div>
      </section>
    </DashboardWidth>
  );
};

export default Donations;
