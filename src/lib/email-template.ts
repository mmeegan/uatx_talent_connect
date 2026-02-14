/**
 * Pre-generated email template for student to initiate coffee chat after mentor accepts.
 */
export function getCoffeeChatEmailTemplate(mentorName: string, mentorEmail: string, requestTitle: string): string {
  const subject = `Coffee chat request: ${requestTitle}`;
  const body = `Hi ${mentorName},

I'd love to schedule a 30-minute coffee chat with you to discuss: ${requestTitle}.

Would you have time in the next couple of weeks for a brief call or in-person coffee?

Thanks!
`;
  return `mailto:${encodeURIComponent(mentorEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
