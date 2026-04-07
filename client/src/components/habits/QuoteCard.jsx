import { Card, Emoji } from '@/components/ui';
import { getRandomQuote } from '@/lib/constants';

export const QuoteCard = () => {
  const quote = getRandomQuote();

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <Emoji size="lg">💬</Emoji>
        </div>
        <div>
          <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
            "{quote.text}"
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
            — {quote.author}
          </p>
        </div>
      </div>
    </Card>
  );
};