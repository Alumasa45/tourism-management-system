export class CreateInquiryDto {
  inquiry_id?: number;
  guest_id?: number;
  user_id?: number;
  inquiry_type: string;
  message: string;
  status: 'open' | 'closed' | 'resolved';
  created_at?: Date;
}
