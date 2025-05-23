interface HowItWorksStepProps {
  number: number;
  title: string;
  description: string;
}

function HowItWorksStep({ number, title, description }: HowItWorksStepProps) {
  return (
    <div className="text-center">
      <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-primary text-2xl">{number}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2 font-serif">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Browse Restaurants",
      description: "Find your favorite restaurants and discover new ones.",
    },
    {
      number: 2,
      title: "Order Your Food",
      description: "Select meals from the menu and add them to your cart.",
    },
    {
      number: 3,
      title: "Enjoy Your Delivery",
      description: "Track your order and enjoy your meal when it arrives.",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 font-serif">
          How It <span className="text-primary">Works</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <HowItWorksStep
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
