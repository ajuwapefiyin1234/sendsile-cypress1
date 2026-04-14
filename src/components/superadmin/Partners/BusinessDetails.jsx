import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PropTypes from 'prop-types';

const brands = [
  {
    id: 'c11ee7d6-0e97-4ce3-a1ba-3bd1a66a9a04',
    name: 'Golden Palm Oil',
    slug: 'golden-palm-oil',
    description:
      'Refined palm oil with a rich, golden color, perfect for frying and cooking.',
    status: 'Inactive',
  },
  {
    id: 'fce6379f-4207-4581-956e-c0ee95f3bdb8',
    name: 'Classic Rice',
    slug: 'classic-rice',
    description:
      'Long-grain rice with a delicate texture, ideal for a variety of dishes.',
    status: 'Inactive',
  },
  {
    id: 'f00828e6-96ef-4419-8120-3f63aed5d98f',
    name: 'Whole Wheat Flour',
    slug: 'whole-wheat-flour',
    description:
      'Nutritious whole wheat flour, perfect for baking and cooking wholesome bread.',
    status: 'Inactive',
  },
  {
    id: '081f25af-5b82-4b33-a2a0-ea615585f8ed',
    name: 'Organic Honey',
    slug: 'organic-honey',
    description:
      'Pure organic honey with a rich, sweet flavor, ideal for sweetening and flavoring.',
    status: 'Inactive',
  },
  {
    id: '622ab1e5-6462-41c9-895c-fc640c737a7f',
    name: 'Almond Butter',
    slug: 'almond-butter',
    description:
      'Creamy almond butter made from roasted almonds, perfect for spreads and recipes.',
    status: 'Inactive',
  },
  {
    id: '914f7fa0-49d0-4122-94c1-db8930dd7f73',
    name: 'Chia Seeds',
    slug: 'chia-seeds',
    description:
      'Nutritious chia seeds rich in omega-3 fatty acids and fiber, great for health-conscious diets.',
    status: 'Inactive',
  },
  {
    id: '62659c46-dfe4-48d5-bfa3-bb2fdbfd1df0',
    name: 'Coconut Milk',
    slug: 'coconut-milk',
    description:
      'Creamy coconut milk with a rich flavor, ideal for cooking and baking.',
    status: 'Active',
  },
  {
    id: 'b9c6dbdd-7e6d-4471-b3bd-cc4441080b33',
    name: 'Maple Syrup',
    slug: 'maple-syrup',
    description:
      'Natural maple syrup with a sweet, rich flavor, perfect for pancakes and waffles.',
    status: 'Active',
  },
  {
    id: '3755825b-45c4-4e0b-aec2-c4397b157872',
    name: 'Quinoa',
    slug: 'quinoa',
    description: 'High-protein quinoa, ideal for salads and as a side dish.',
    status: 'Active',
  },
  {
    id: '54ceb5de-53e5-4a29-b316-a3b304f791f6',
    name: 'Black Beans',
    slug: 'black-beans',
    description:
      'Nutritious black beans, perfect for soups, stews, and salads.',
    status: 'Inactive',
  },
  {
    id: '552099f3-8de3-4297-8de0-a3041afa5dcb',
    name: 'Oatmeal',
    slug: 'oatmeal',
    description:
      'Hearty oatmeal with a smooth texture, ideal for a nutritious breakfast.',
    status: 'Inactive',
  },
  {
    id: '004bb284-1f20-4cd1-8b34-c350ad0d4393',
    name: 'Tomato Sauce',
    slug: 'tomato-sauce',
    description:
      'Rich and flavorful tomato sauce, perfect for pasta and pizza.',
    status: 'Active',
  },
  {
    id: 'dcd80d62-3189-4fa7-a218-33e8f0fac9f1',
    name: 'Cashew Nuts',
    slug: 'cashew-nuts',
    description:
      'Crunchy and nutritious cashew nuts, great as a snack or ingredient in recipes.',
    status: 'Active',
  },
  {
    id: 'd8466ac9-f1f0-4704-ba74-9d84928d925b',
    name: 'Soy Sauce',
    slug: 'soy-sauce',
    description:
      'Savory soy sauce with a deep umami flavor, essential for Asian dishes.',
    status: 'Inactive',
  },
  {
    id: '23657f3c-6625-4238-974f-04c8aa65652e',
    name: 'Greek Yogurt',
    slug: 'greek-yogurt',
    description:
      'Thick and creamy Greek yogurt, perfect for breakfast or as a base for sauces.',
    status: 'Active',
  },
  {
    id: '9f57b56a-5ffc-4a97-86b0-7ec55d39a860',
    name: 'Almond Flour',
    slug: 'almond-flour',
    description:
      'Finely ground almond flour, ideal for gluten-free baking and cooking.',
    status: 'Active',
  },
  {
    id: '9e393a76-92da-4317-9a9d-d0eef51a24b9',
    name: 'Peanut Butter',
    slug: 'peanut-butter',
    description:
      'Smooth and creamy peanut butter, perfect for sandwiches and recipes.',
    status: 'Active',
  },
  {
    id: '74a74b73-3fe7-4afa-b171-2c3a8fb9f36c',
    name: 'Balsamic Vinegar',
    slug: 'balsamic-vinegar',
    description:
      'Rich and tangy balsamic vinegar, great for dressings and marinades.',
    status: 'Inactive',
  },
  {
    id: 'ff3dcd17-8dba-40a8-8470-8ec78f183f64',
    name: 'Sunflower Seeds',
    slug: 'sunflower-seeds',
    description:
      'Nutritious sunflower seeds, ideal as a snack or ingredient in salads and granola.',
    status: 'Active',
  },
  {
    id: '0a60561b-a178-4eb3-a054-558056790457',
    name: 'Couscous',
    slug: 'couscous',
    description:
      'Fluffy and versatile couscous, perfect as a side dish or base for salads.',
    status: 'Inactive',
  },
];
const BusinessDetails = ({ control }) => {
  return (
    <div className="flex flex-col items-start gap-8 w-full   ">
      <h2 className="font-medium text-[16px] leading-[22px] text-[#45464E]">
        Business Details
      </h2>
      <div className="flex flex-col items-start gap-5 w-full">
        <FormField
          control={control}
          name="businessName"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
              <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                Business Name
              </FormLabel>
              <FormControl className="w-full ">
                <Input
                  className="text-[14px] leading-[20px]  placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full"
                  placeholder="Tantacom"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="businessType"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
              <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                Business Type
              </FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-[14px]  leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full">
                    <SelectValue
                      className="text-[14px] leading-[19px] text-[#8B909A] placeholder:text-[#8B909A]"
                      placeholder={'Select Type...'}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {brands?.map((brand, index) => (
                    <SelectItem
                      key={brand.id}
                      className={`text-[14px] leading-[19px] text-[#8B909A] ${
                        brand.length === index + 1
                          ? ''
                          : 'border-b border-[#ECEEF4]'
                      }`}
                      value={brand?.id || ''}
                    >
                      {brand?.name || 'NA'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="border md:block hidden border-[#ECEEF4] w-full" />

      <div className="flex flex-col items-start gap-8 w-full">
        <h3 className="font-medium text-[16px] leading-[22px] text-[#45464E]">
          Contact Information
        </h3>

        <div className="flex flex-col items-start gap-5 w-full">
          <FormField
            control={control}
            name="partnerEmail"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
                <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                  Partner&apos;s Email
                </FormLabel>
                <FormControl className="w-full ">
                  <Input
                    className="text-[14px] leading-[20px]  placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full"
                    placeholder="Tantacom"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="contactPersonName"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
                <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                  Contact Person&apos;s Name
                </FormLabel>
                <FormControl className="w-full ">
                  <Input
                    className="text-[14px] leading-[20px]  placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full"
                    placeholder="Omotayo Gbolahan"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="contactPersonPhoneNumber"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
                <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                  Contact Person&apos;s Phone Number
                </FormLabel>
                <FormControl className="w-full ">
                  <Input
                    className="text-[14px] leading-[20px]  placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full"
                    placeholder="07045532101"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

BusinessDetails.propTypes = {
  control: PropTypes.object.isRequired,
  watch: PropTypes.object,
};

export default BusinessDetails;
