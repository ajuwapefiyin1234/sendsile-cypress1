import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { VARAITIONTYPEOPTIONS } from '@/lib/reusable';
import { Textarea } from './ui/textarea';
import { TbMinus, TbPlus } from 'react-icons/tb';
import { toast } from 'sonner';
import { CustomCombobox } from './CustomCombobox';
import { useLocation } from 'react-router-dom';

const GeneralInformation = ({ control, watch }) => {
  const location = useLocation();
  // Determine if the route is for the super admin
  const isSuperAdmin = location.pathname.includes('super-admin');

  const [variations, setVariations] = useState([{ id: Date.now() }]);
  const handleAddVariation = () => {
    if (variations.length < 3) {
      setVariations([...variations, { id: Date.now() }]);
    } else {
      toast.error('You can only add up to 3 variations');
    }
  };

  const handleRemoveVariation = (id) => {
    setVariations(variations.filter((variation) => variation.id !== id));
  };

  // Extract the variationType from each object
  const selectedVariationTypes = watch?.variations.map(
    (variation) => variation.variationType
  );

  // Check if there are duplicates by comparing the size of the Set with the length of the array
  const hasDuplicates =
    new Set(selectedVariationTypes).size !== selectedVariationTypes.length;
  return (
    <div className="flex flex-col items-start gap-8 w-full   ">
      <h2 className="font-medium text-[16px] leading-[22px] text-[#45464E]">
        General Information
      </h2>
      <div className="flex flex-col items-start gap-5 w-full">
        <FormField
          control={control}
          name="productName"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
              <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                Product Name
              </FormLabel>
              <FormControl className="w-full ">
                <Input
                  className="text-[14px] leading-[20px]  placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full"
                  placeholder="Cucumber"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="brand"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
              <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                Brands
              </FormLabel>
              <FormControl className="w-full ">
                <CustomCombobox
                  onChange={field.onChange}
                  value={field.value}
                  name="brand"
                  isSuperAdmin={isSuperAdmin}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-5 w-full">
          <FormField
            control={control}
            name="sku"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
                <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                  SKU
                </FormLabel>
                <FormControl className="w-full ">
                  <Input
                    className="text-[14px] leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full"
                    placeholder="4701"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
                <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                  Category
                </FormLabel>
                <FormControl className="w-full ">
                  <CustomCombobox
                    onChange={field.onChange}
                    value={field.value}
                    name="category"
                    isSuperAdmin={isSuperAdmin}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
              <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Lorem ipsum dolor sit amet consectetur. Feugiat adipiscing sit proin et nunc turpis sapien sed."
                  className="text-[14px] leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4 w-full"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="border md:block hidden border-[#ECEEF4] w-full" />

      <div className="flex flex-col items-start gap-8 w-full">
        <h3 className="font-medium text-[16px] leading-[22px] text-[#45464E]">
          Product Variant
        </h3>

        {/* variation handling */}
        <div className="flex flex-col gap-2 w-full">
          {variations.map((variation, index) => (
            <div key={variation.id} className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`variations.${index}.variationType`}
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
                    <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                      Variation Type
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={`text-[14px]  leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px]  ${
                            index !== variations.length &&
                            'border border-[#DEDEDE]'
                          }  bg-white p-4 w-full`}
                        >
                          <SelectValue
                            className=""
                            placeholder="Select a variation"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {VARAITIONTYPEOPTIONS.map((option, index) => (
                          <SelectItem
                            key={option.value}
                            className={`text-[14px] leading-[19px] text-[#8B909A] ${
                              VARAITIONTYPEOPTIONS.length === index + 1
                                ? ''
                                : 'border-b border-[#ECEEF4]'
                            } `}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`variations.${index}.variation`}
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
                    <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                      Variation
                    </FormLabel>
                    <FormControl className="w-full ">
                      <Input
                        className="text-[14px] leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full"
                        placeholder=""
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedVariationTypes?.length > 1 && (
                <div
                  onClick={() => handleRemoveVariation(variation.id)}
                  className="cursor-pointer  flex px-0 py-0 gap-1 items-center text-[15px] leading-[21px] font-medium text-[#E4572E] w-fit"
                >
                  <TbMinus className="w-4 h-4" />
                  <p>Remove variant</p>
                </div>
              )}
            </div>
          ))}

          {hasDuplicates && (
            <p className="text-sm font-medium text-destructive">
              Contains duplicate
            </p>
          )}

          <div
            onClick={handleAddVariation}
            className="cursor-pointer  flex px-0 py-0 gap-1 items-center text-[15px] leading-[21px] font-medium text-[#E4572E] w-fit"
          >
            <TbPlus className="w-4 h-4" />
            <p>Add variant</p>
          </div>
        </div>
      </div>
    </div>
  );
};

GeneralInformation.propTypes = {
  control: PropTypes.object.isRequired,
  watch: PropTypes.object.isRequired,
};

export default GeneralInformation;
