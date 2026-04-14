import PropTypes from 'prop-types';
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
import { Switch } from './ui/switch';
import { discountOptions } from '@/lib/reusable';
import { useLocation } from 'react-router-dom';

const PriceAndStockInformation = ({ control, watch }) => {
  const location = useLocation();
  // Determine if the route is for the super admin
  const isSuperAdmin = location.pathname.includes('super-admin');
  return (
    <div className="flex flex-col items-start gap-8  w-full  ">
      <h2 className="font-medium text-[16px] leading-[22px] text-[#45464E]">
        Pricing & Stock Information
      </h2>

      <div className="flex flex-col items-start p-0 gap-5 w-full">
        <FormField
          control={control}
          name="price"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
              <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                Price
              </FormLabel>
              <FormControl className="w-full ">
                <div className="flex  items-center gap-0 w-full border border-[#DEDEDE] rounded-[6px] has-[:focus-visible]:border-[#E4572E] has-[:focus-visible]:ring-4  has-[:focus-visible]:ring-[#FFE6DC]">
                  <div className="flex  items-center justify-center py-[9.6px] bg-white  rounded-l-[6px] font-medium text-[14px] text-[#708090] leading-[19px]">
                    <div className="border-r border-[#DEDEDE]  px-4">
                      &#8358;
                    </div>
                  </div>
                  <Input
                    className="text-[14px] appearance-none leading-[20px] placeholder:text-[#B2C2D2] rounded-r-[6px] rounded-l-none border-0  border-[#DEDEDE] bg-white p-4  w-full focus-visible:ring-0 focus-visible:border-0"
                    placeholder="0"
                    {...field}
                  />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="quantityInStock"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
              <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                Quantity in Stock
              </FormLabel>
              <FormControl className="w-full ">
                <Input
                  className="text-[14px] leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full"
                  placeholder="set quantity in stock"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="productAvailability"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
              <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                Product Availability
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-[14px] leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    className="text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
                    value="In Stock"
                  >
                    In Stock
                  </SelectItem>
                  <SelectItem
                    className="text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
                    value="Low Stock"
                  >
                    Low in Stock
                  </SelectItem>
                  <SelectItem
                    className="text-[14px] leading-[19px] text-[#8B909A]"
                    value="Out of Stock"
                  >
                    Out of Stock
                  </SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {isSuperAdmin && (
          <FormField
            control={control}
            name="partner"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
                <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                  Partner
                </FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="text-[14px] leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full">
                      <SelectValue placeholder="Select partner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      className="text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
                      value="Tatancom"
                    >
                      Tatancom
                    </SelectItem>
                    <SelectItem
                      className="text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
                      value="Sapp Business"
                    >
                      Sapp Business
                    </SelectItem>
                    <SelectItem
                      className="text-[14px] leading-[19px] text-[#8B909A]"
                      value="Kings Oil"
                    >
                      Kings Oil
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex items-start justify-between w-full">
          <h4 className="font-medium text-[16px] leading-[22.4px] text-[#8B8D97]">
            Discount
          </h4>

          <FormField
            control={control}
            name="discount"
            render={({ field }) => (
              <FormItem className="flex gap-5 items-center justify-items-center">
                <FormLabel className="text-[14px] leading-[19px] text-[#2B2F32]">
                  Add Discount
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="w-10 h-[14px]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {watch.discount && (
          <div className="grid grid-cols-2 gap-5 w-full">
            <FormField
              control={control}
              name="discountType"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
                  <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                    Discount Type
                  </FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-[14px] leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4 w-full">
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {discountOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          className="text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
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
              name="discountValue"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
                  <FormLabel className="text-[14px] leading-[20px] text-[#36454F] text-nowrap truncate">
                    Discount Value (%)
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
          </div>
        )}
      </div>
    </div>
  );
};

PriceAndStockInformation.propTypes = {
  control: PropTypes.object.isRequired,
  watch: PropTypes.object.isRequired,
};

export default PriceAndStockInformation;
